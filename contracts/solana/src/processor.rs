// Fluidity smart contract state processor

use crate::{
    instruction::*,
    math::*,
    state::{Obligation, Reserve},
    utils::*,
};

use {
    borsh::{BorshDeserialize, BorshSerialize}, solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint::ProgramResult,
        instruction::{AccountMeta, Instruction},
        log::sol_log_compute_units,
        msg,
        program::{invoke, invoke_signed},
        program_error::ProgramError,
        program_pack::{IsInitialized, Pack},
        pubkey::Pubkey,
        system_instruction, system_program,
    },
    spl_token,
    std::{convert::TryFrom, str::FromStr},
};

// the public key of the account that is allowed to initialize tokens
const INIT_AUTHORITY: &str = "B6xiDeQ9gNHdM4XG1VqHwyFR3AqUukKAzzhDFJirkgqP";

// the public key of the solend program
const SOLEND: &str = "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo";

// struct defining fludity data account
#[derive(BorshDeserialize, BorshSerialize, Debug, PartialEq, Clone)]
pub struct FluidityData {
    token_mint: Pubkey,
    fluid_mint: Pubkey,
    pda: Pubkey,
    payout_authority: Pubkey,
    large_payout_authority: Pubkey,
    wrapping_enabled: bool,
    block_payout_threshold: u64,
    global_mint_remaining: u64,
}

// wrap amount of token into corresponding fluidity token
fn wrap(
    accounts: &[AccountInfo],
    program_id: &Pubkey,
    amount: u64,
    seed: String,
    bump: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let fluidity_data_account = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;
    let token_mint = next_account_info(accounts_iter)?;
    let fluidity_mint = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let sender = next_account_info(accounts_iter)?;
    let token_account = next_account_info(accounts_iter)?;
    let fluidity_account = next_account_info(accounts_iter)?;

    // Accounts to pass through to solend - not being verified by us
    let solend_program = next_account_info(accounts_iter)?;
    let collateral_info = next_account_info(accounts_iter)?;
    let reserve_info = next_account_info(accounts_iter)?;
    let reserve_liquidity_supply_info = next_account_info(accounts_iter)?;
    let reserve_collateral_mint_info = next_account_info(accounts_iter)?;
    let lending_market_info = next_account_info(accounts_iter)?;
    let lending_market_authority_info = next_account_info(accounts_iter)?;
    let destination_collateral_info = next_account_info(accounts_iter)?;
    let obligation_info = next_account_info(accounts_iter)?;
    let pyth_price_info = next_account_info(accounts_iter)?;
    let switchboard_feed_info = next_account_info(accounts_iter)?;
    let clock_info = next_account_info(accounts_iter)?;

    if amount < 2 {
        panic!("Amount of liquidity less than two, Solend rounding error!");
    }

    // check solend contract
    if solend_program.key != &Pubkey::from_str(SOLEND).unwrap() {
        panic!("bad Solend contract!");
    }

    // create seed strings following format
    let pda_seed = format!("FLU:{}_OBLIGATION", seed);
    let data_seed = format!("FLU:{}_DATA", seed);

    // check that data account is derived from pda
    if fluidity_data_account.key
        != &Pubkey::create_with_seed(pda_account.key, &data_seed, program_id).unwrap()
    {
        panic!("bad data account");
    }

    // check mints
    let mut fluidity_data = validate_fluidity_data_account(
        &fluidity_data_account,
        *token_mint.key,
        *fluidity_mint.key,
        *pda_account.key,
    );

    if !fluidity_data.wrapping_enabled {
        panic!("wrapping is disabled");
    }

    if fluidity_data.global_mint_remaining < amount {
        panic!("global mint limit reached");
    }

    // write the remaining mint limit
    let remaining_global_mint = fluidity_data.global_mint_remaining.checked_sub(amount)
        .expect("global mint limit reached");
    fluidity_data.global_mint_remaining = remaining_global_mint;

    let mut data = fluidity_data_account.try_borrow_mut_data()?;
    fluidity_data.serialize(&mut &mut data[..])?;

    // check collateral and obligation ownership
    let obligation = Obligation::unpack(&obligation_info.data.borrow())?;
    if &obligation.owner != pda_account.key {
        panic!("bad obligation ownership!");
    }
    let collateral = spl_token::state::Account::unpack(&collateral_info.data.borrow())?;
    if &collateral.owner != pda_account.key {
        panic!("bad collateral ownership!");
    }

    // refresh reserve
    invoke(
        &Instruction::new_with_borsh(
            *solend_program.key,
            &LendingInstruction::RefreshReserve,
            vec![
                AccountMeta::new(*reserve_info.key, false),
                AccountMeta::new_readonly(*pyth_price_info.key, false),
                AccountMeta::new_readonly(*switchboard_feed_info.key, false),
                AccountMeta::new_readonly(*clock_info.key, false),
            ],
        ),
        &[
            reserve_info.clone(),
            pyth_price_info.clone(),
            switchboard_feed_info.clone(),
            clock_info.clone(),
            solend_program.clone(),
        ],
    )?;

    // deposit liquidity from user token account
    invoke(
        &Instruction::new_with_borsh(
            *solend_program.key,
            &LendingInstruction::DepositReserveLiquidity {
                liquidity_amount: amount,
            },
            vec![
                AccountMeta::new(*token_account.key, false),
                AccountMeta::new(*collateral_info.key, false),
                AccountMeta::new(*reserve_info.key, false),
                AccountMeta::new(*reserve_liquidity_supply_info.key, false),
                AccountMeta::new(*reserve_collateral_mint_info.key, false),
                AccountMeta::new(*lending_market_info.key, false),
                AccountMeta::new_readonly(*lending_market_authority_info.key, false),
                AccountMeta::new(*sender.key, true),
                AccountMeta::new_readonly(*clock_info.key, false),
                AccountMeta::new_readonly(*token_program.key, false),
            ],
        ),
        &[
            token_account.clone(),
            collateral_info.clone(),
            reserve_info.clone(),
            reserve_liquidity_supply_info.clone(),
            reserve_collateral_mint_info.clone(),
            lending_market_info.clone(),
            lending_market_authority_info.clone(),
            sender.clone(),
            clock_info.clone(),
            token_program.clone(),
        ],
    )?;

    // refresh reserve again
    invoke(
        &Instruction::new_with_borsh(
            *solend_program.key,
            &LendingInstruction::RefreshReserve,
            vec![
                AccountMeta::new(*reserve_info.key, false),
                AccountMeta::new_readonly(*pyth_price_info.key, false),
                AccountMeta::new_readonly(*switchboard_feed_info.key, false),
                AccountMeta::new_readonly(*clock_info.key, false),
            ],
        ),
        &[
            reserve_info.clone(),
            pyth_price_info.clone(),
            switchboard_feed_info.clone(),
            clock_info.clone(),
            solend_program.clone(),
        ],
    )?;

    // calculate collateral amount
    let reserve = Reserve::unpack(&reserve_info.data.borrow())?;
    let collateral_amount = reserve
        .collateral_exchange_rate()?
        .liquidity_to_collateral(amount)?;

    // deposit collateral into obligation
    invoke_signed(
        &Instruction::new_with_borsh(
            *solend_program.key,
            &LendingInstruction::DepositObligationCollateral { collateral_amount },
            vec![
                AccountMeta::new(*collateral_info.key, false),
                AccountMeta::new(*destination_collateral_info.key, false),
                AccountMeta::new(*reserve_info.key, false),
                AccountMeta::new(*obligation_info.key, false),
                AccountMeta::new(*lending_market_info.key, false),
                AccountMeta::new(*pda_account.key, true),
                AccountMeta::new(*pda_account.key, true),
                AccountMeta::new_readonly(*clock_info.key, false),
                AccountMeta::new_readonly(*token_program.key, false),
            ],
        ),
        &[
            collateral_info.clone(),
            destination_collateral_info.clone(),
            reserve_info.clone(),
            obligation_info.clone(),
            lending_market_info.clone(),
            pda_account.clone(),
            clock_info.clone(),
            token_program.clone(),
        ],
        &[&[&pda_seed.as_bytes(), &[bump]]],
    )?;

    // mint fluid tokens to user account
    invoke_signed(
        &spl_token::instruction::mint_to(
            &token_program.key,
            &fluidity_mint.key,
            &fluidity_account.key,
            &pda_account.key,
            &[&pda_account.key],
            amount,
        )
        .unwrap(),
        &[
            fluidity_mint.clone(),
            fluidity_account.clone(),
            pda_account.clone(),
            token_program.clone(),
        ],
        &[&[&pda_seed.as_bytes(), &[bump]]],
    )?;

    Ok(())
}

// unwrap amount of fluid token into corresponding token
fn unwrap(
    accounts: &[AccountInfo],
    program_id: &Pubkey,
    amount: u64,
    seed: String,
    bump: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let fluidity_data_account = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;
    let token_mint = next_account_info(accounts_iter)?;
    let fluidity_mint = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let sender = next_account_info(accounts_iter)?;
    let token_account = next_account_info(accounts_iter)?;
    let fluidity_account = next_account_info(accounts_iter)?;
    let solend_program = next_account_info(accounts_iter)?;
    let collateral_info = next_account_info(accounts_iter)?;
    let reserve_info = next_account_info(accounts_iter)?;
    let reserve_liquidity_supply_info = next_account_info(accounts_iter)?;
    let reserve_collateral_mint_info = next_account_info(accounts_iter)?;
    let lending_market_info = next_account_info(accounts_iter)?;
    let lending_market_authority_info = next_account_info(accounts_iter)?;
    let deposited_collateral_info = next_account_info(accounts_iter)?;
    let obligation_info = next_account_info(accounts_iter)?;
    let pyth_price_info = next_account_info(accounts_iter)?;
    let switchboard_feed_info = next_account_info(accounts_iter)?;
    let clock_info = next_account_info(accounts_iter)?;

    // check solend contract
    if solend_program.key != &Pubkey::from_str(SOLEND).unwrap() {
        panic!("bad Solend contract!");
    }

    // check collateral and obligation ownership
    let obligation = Obligation::unpack(&obligation_info.data.borrow())?;
    if &obligation.owner != pda_account.key {
        panic!("bad obligation ownership!");
    }
    let collateral = spl_token::state::Account::unpack(&collateral_info.data.borrow())?;
    if &collateral.owner != pda_account.key {
        panic!("bad collateral ownership!");
    }

    // create seed strings from provided token
    let pda_seed = format!("FLU:{}_OBLIGATION", seed);
    let data_seed = format!("FLU:{}_DATA", seed);

    // check that data account is derived from pda
    if fluidity_data_account.key
        != &Pubkey::create_with_seed(pda_account.key, &data_seed, program_id).unwrap()
    {
        panic!("bad data account");
    }

    validate_fluidity_data_account(
        &fluidity_data_account,
        *token_mint.key,
        *fluidity_mint.key,
        *pda_account.key,
    );

    // burn fluid tokens
    invoke(
        &spl_token::instruction::burn(
            &token_program.key,
            &fluidity_account.key,
            &fluidity_mint.key,
            &sender.key,
            &[&sender.key],
            amount,
        )
        .unwrap(),
        &[
            fluidity_account.clone(),
            fluidity_mint.clone(),
            sender.clone(),
        ],
    )?;

    // refresh reserve
    invoke(
        &Instruction::new_with_borsh(
            *solend_program.key,
            &LendingInstruction::RefreshReserve,
            vec![
                AccountMeta::new(*reserve_info.key, false),
                AccountMeta::new_readonly(*pyth_price_info.key, false),
                AccountMeta::new_readonly(*switchboard_feed_info.key, false),
                AccountMeta::new_readonly(*clock_info.key, false),
            ],
        ),
        &[
            reserve_info.clone(),
            pyth_price_info.clone(),
            switchboard_feed_info.clone(),
            clock_info.clone(),
            solend_program.clone(),
        ],
    )?;

    // refresh obligation
    invoke(
        &Instruction::new_with_borsh(
            *solend_program.key,
            &LendingInstruction::RefreshObligation,
            vec![
                AccountMeta::new(*obligation_info.key, false),
                AccountMeta::new_readonly(*clock_info.key, false),
                AccountMeta::new(*reserve_info.key, false),
            ],
        ),
        &[
            obligation_info.clone(),
            clock_info.clone(),
            reserve_info.clone(),
            solend_program.clone(),
        ],
    )?;

    // calculate collateral amount from refreshed reserve
    let reserve = Box::new(Reserve::unpack(&reserve_info.data.borrow())?);
    let collateral_amount = reserve
        .collateral_exchange_rate()?
        .liquidity_to_collateral(amount)?;

    // withdraw from solend to the user's token account
    invoke_signed(
        &Instruction::new_with_borsh(
            *solend_program.key,
            &LendingInstruction::WithdrawObligationCollateralAndRedeemReserveCollateral {
                collateral_amount,
            },
            vec![
                AccountMeta::new(*deposited_collateral_info.key, false),
                AccountMeta::new(*collateral_info.key, false),
                AccountMeta::new(*reserve_info.key, false),
                AccountMeta::new(*obligation_info.key, false),
                AccountMeta::new(*lending_market_info.key, false),
                AccountMeta::new_readonly(*lending_market_authority_info.key, false),
                AccountMeta::new(*token_account.key, false),
                AccountMeta::new(*reserve_collateral_mint_info.key, false),
                AccountMeta::new(*reserve_liquidity_supply_info.key, false),
                AccountMeta::new(*pda_account.key, true),
                AccountMeta::new(*pda_account.key, true),
                AccountMeta::new_readonly(*clock_info.key, false),
                AccountMeta::new_readonly(*token_program.key, false),
            ],
        ),
        &[
            deposited_collateral_info.clone(),
            collateral_info.clone(),
            reserve_info.clone(),
            obligation_info.clone(),
            lending_market_info.clone(),
            lending_market_authority_info.clone(),
            token_account.clone(),
            reserve_collateral_mint_info.clone(),
            reserve_liquidity_supply_info.clone(),
            pda_account.clone(),
            clock_info.clone(),
            token_program.clone(),
            solend_program.clone(),
        ],
        &[&[&pda_seed.as_bytes(), &[bump]]],
    )?;

    Ok(())
}

// takes an amount of tokens, and two acounts and pays out in an 8:2 split,
// totalling at most 80% of the prize pool - must be run by authority
fn payout(
    accounts: &[AccountInfo],
    amount: u64,
    seed: String,
    bump: u8,
    program_id: &Pubkey,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let fluidity_data_account = next_account_info(accounts_iter)?;
    let token_mint = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;
    let fluidity_mint = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let obligation_info = next_account_info(accounts_iter)?;
    let reserve_info = next_account_info(accounts_iter)?;
    let payout_account_a = next_account_info(accounts_iter)?;
    let payout_account_b = next_account_info(accounts_iter)?;
    let payer = next_account_info(accounts_iter)?;

    let data_seed = format!("FLU:{}_DATA", seed);
    if fluidity_data_account.key
        != &Pubkey::create_with_seed(pda_account.key, &data_seed, program_id).unwrap()
    {
        panic!("bad data account");
    }

    // check mints
    let fluidity_data = validate_fluidity_data_account(
        &fluidity_data_account,
        *token_mint.key,
        *fluidity_mint.key,
        *pda_account.key,
    );

    // check payout authority
    if !payer.is_signer {
        panic!("bad payout authority!");
    }

    let large_payouts_allowed;

    if *payer.key == fluidity_data.payout_authority {
        large_payouts_allowed = false;
    } else if *payer.key == fluidity_data.large_payout_authority {
        large_payouts_allowed = true;
    } else {
        panic!("bad payout authority!");
    }

    // scale/clamp amount to be AT MOST 80% of the prize pool

    let total_prize_pool = get_available_prize_pool(obligation_info, reserve_info, fluidity_mint);

    // get available prize pool (80% of pool)
    let available_prize_pool = total_prize_pool
        .checked_mul(8)
        .unwrap()
        .checked_div(10)
        .unwrap();

    // set new amount
    let scaled_amount = if amount > available_prize_pool {
        available_prize_pool
    } else {
        amount
    };

    if scaled_amount > fluidity_data.block_payout_threshold {
        if !large_payouts_allowed {
            msg!(
                "Large payout blocked! Token mint {}, amount {}, from {}, to {}",
                fluidity_mint.key,
                scaled_amount,
                payout_account_a.key,
                payout_account_b.key,
            );
            return Ok(());
        }
    }

    // separate pool into 8:2 split between sender and receiver
    let sender_prize = scaled_amount
        .checked_mul(8)
        .unwrap()
        .checked_div(10)
        .unwrap();
    let receiver_prize = scaled_amount
        .checked_mul(2)
        .unwrap()
        .checked_div(10)
        .unwrap();

    let pda_seed = format!("FLU:{}_OBLIGATION", seed);

    // mint fluid tokens to both receivers

    invoke_signed(
        &spl_token::instruction::mint_to(
            &token_program.key,
            &fluidity_mint.key,
            &payout_account_a.key,
            &pda_account.key,
            &[&pda_account.key],
            sender_prize,
        )
        .unwrap(),
        &[
            fluidity_mint.clone(),
            payout_account_a.clone(),
            pda_account.clone(),
            token_program.clone(),
        ],
        &[&[&pda_seed.as_bytes(), &[bump]]],
    )?;

    invoke_signed(
        &spl_token::instruction::mint_to(
            &token_program.key,
            &fluidity_mint.key,
            &payout_account_b.key,
            &pda_account.key,
            &[&pda_account.key],
            receiver_prize,
        )
        .unwrap(),
        &[
            fluidity_mint.clone(),
            payout_account_b.clone(),
            pda_account.clone(),
            token_program.clone(),
        ],
        &[&[&pda_seed.as_bytes(), &[bump]]],
    )?;

    Ok(())
}

// Moves amount funds from prize pool to another account
// Will fail if funds exceed total prize pool - must be run by authority
fn move_from_prize_pool(
    accounts: &[AccountInfo],
    payout_amt: u64,
    seed: String,
    bump: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let token_program = next_account_info(accounts_iter)?;
    let token_mint = next_account_info(accounts_iter)?;
    let fluidity_mint = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let obligation_info = next_account_info(accounts_iter)?;
    let reserve_info = next_account_info(accounts_iter)?;
    let payout_account = next_account_info(accounts_iter)?;
    let payer = next_account_info(accounts_iter)?;
    let fluidity_data_account = next_account_info(accounts_iter)?;

    let fluidity_data = validate_fluidity_data_account(
        fluidity_data_account,
        *token_mint.key,
        *fluidity_mint.key,
        *pda_account.key,
    );
    // check payout authority
    if !(payer.is_signer && *payer.key == fluidity_data.payout_authority) {
        panic!("bad payout authority!");
    }

    // Fail if amount exceeds prize pool
    let available_prize_pool =
        get_available_prize_pool(obligation_info, reserve_info, fluidity_mint);

    if available_prize_pool < payout_amt {
        panic!("not enough funds in prize pool!");
    }

    let pda_seed = format!("FLU:{}_OBLIGATION", seed);

    // mint fluid tokens to payout account

    invoke_signed(
        &spl_token::instruction::mint_to(
            &token_program.key,
            &fluidity_mint.key,
            &payout_account.key,
            &pda_account.key,
            &[&pda_account.key],
            payout_amt,
        )
        .unwrap(),
        &[
            fluidity_mint.clone(),
            payout_account.clone(),
            pda_account.clone(),
            token_program.clone(),
        ],
        &[&[&pda_seed.as_bytes(), &[bump]]],
    )?;

    Ok(())
}

// initialise obligation account controlled by PDA - must be run by authority
fn init_solend_obligation(
    accounts: &[AccountInfo],
    obligation_lamports: u64,
    obligation_size: u64,
    seed: String,
    bump: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let payer = next_account_info(accounts_iter)?;
    let solend_program = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    // init obligation infos
    let obligation_info = next_account_info(accounts_iter)?;
    let lending_market_info = next_account_info(accounts_iter)?;
    let obligation_owner_info = next_account_info(accounts_iter)?;
    let clock_info = next_account_info(accounts_iter)?;
    let rent_info = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;

    // check init authority
    if !(payer.is_signer && payer.key == &Pubkey::from_str(INIT_AUTHORITY).unwrap()) {
        panic!("bad init authority!");
    }

    let pda_seed = format!("FLU:{}_OBLIGATION", seed);

    invoke_signed(
        &system_instruction::create_account_with_seed(
            &payer.key,
            &obligation_info.key,
            &obligation_owner_info.key,
            &lending_market_info.key.to_string()[0..32],
            obligation_lamports,
            obligation_size,
            &solend_program.key,
        ),
        &[
            payer.clone(),
            obligation_info.clone(),
            obligation_owner_info.clone(),
            lending_market_info.clone(),
            solend_program.clone(),
            system_program.clone(),
        ],
        &[&[&pda_seed.as_bytes(), &[bump]]],
    )?;

    invoke_signed(
        &Instruction::new_with_borsh(
            *solend_program.key,
            &LendingInstruction::InitObligation,
            vec![
                AccountMeta::new(*obligation_info.key, false),
                AccountMeta::new(*lending_market_info.key, false),
                AccountMeta::new(*obligation_owner_info.key, true),
                AccountMeta::new_readonly(*clock_info.key, false),
                AccountMeta::new_readonly(*rent_info.key, false),
                AccountMeta::new_readonly(*token_program.key, false),
            ],
        ),
        &[
            obligation_info.clone(),
            lending_market_info.clone(),
            obligation_owner_info.clone(),
            clock_info.clone(),
            rent_info.clone(),
            token_program.clone(),
            solend_program.clone(),
        ],
        &[&[&pda_seed.as_bytes(), &[bump]]],
    )?;

    Ok(())
}

// takes a data account derived from a base account, and serialises the total value of obligations into it
pub fn log_tvl(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let data_account = next_account_info(accounts_iter)?;
    let base = next_account_info(accounts_iter)?;
    let solend_program = next_account_info(accounts_iter)?;
    let obligation_info = next_account_info(accounts_iter)?;
    let reserve_info = next_account_info(accounts_iter)?;
    let pyth_price_info = next_account_info(accounts_iter)?;
    let switchboard_feed_info = next_account_info(accounts_iter)?;
    let clock_info = next_account_info(accounts_iter)?;

    // check that data account is derived from base
    if data_account.key != &Pubkey::create_with_seed(base.key, "FLU:TVL_DATA", program_id).unwrap()
    {
        panic!("bad data account");
    }

    // refresh solend accounts

    invoke(
        &Instruction::new_with_borsh(
            *solend_program.key,
            &LendingInstruction::RefreshReserve,
            vec![
                AccountMeta::new(*reserve_info.key, false),
                AccountMeta::new_readonly(*pyth_price_info.key, false),
                AccountMeta::new_readonly(*switchboard_feed_info.key, false),
                AccountMeta::new_readonly(*clock_info.key, false),
            ],
        ),
        &[
            reserve_info.clone(),
            pyth_price_info.clone(),
            switchboard_feed_info.clone(),
            clock_info.clone(),
            solend_program.clone(),
        ],
    )?;

    invoke(
        &Instruction::new_with_borsh(
            *solend_program.key,
            &LendingInstruction::RefreshObligation,
            vec![
                AccountMeta::new(*obligation_info.key, false),
                AccountMeta::new_readonly(*clock_info.key, false),
                AccountMeta::new(*reserve_info.key, false),
            ],
        ),
        &[
            obligation_info.clone(),
            clock_info.clone(),
            reserve_info.clone(),
            solend_program.clone(),
        ],
    )?;

    // deserialize obligation and reserve
    let obligation = Obligation::unpack(&obligation_info.data.borrow())?;
    let reserve = Reserve::unpack(&reserve_info.data.borrow())?;

    // get data
    let mut data = data_account.try_borrow_mut_data()?;

    // serialize value of obligations (incl. interest) into data account
    // get scaled u128 val. it has 18 decimal places so divide by 1e18-n to get n decimals
    let deposited_amount = obligation.deposits[0].deposited_amount;
    let deposited_value = reserve
        .collateral_exchange_rate()?
        .collateral_to_liquidity(deposited_amount)
        .unwrap();

    deposited_value.serialize(&mut &mut data[..])?;

    Ok(())
}

fn update_mint_limit(
    accounts: &[AccountInfo],
    program_id: &Pubkey,
    limit: u64,
    seed: String,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let fluidity_data_account = next_account_info(accounts_iter)?;
    let token_mint = next_account_info(accounts_iter)?;
    let fluidity_mint = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let payer = next_account_info(accounts_iter)?;

    let data_seed = format!("FLU:{}_DATA", seed);
    if fluidity_data_account.key
        != &Pubkey::create_with_seed(pda_account.key, &data_seed, program_id).unwrap()
    {
        panic!("bad data account");
    }
    let mut fluidity_data = validate_fluidity_data_account(
        fluidity_data_account,
        *token_mint.key,
        *fluidity_mint.key,
        *pda_account.key,
    );

    if !(payer.is_signer && *payer.key == fluidity_data.payout_authority) {
        panic!("bad payout authority");
    }

    fluidity_data.global_mint_remaining = limit;

    // borrow the data and write
    let mut data = fluidity_data_account.try_borrow_mut_data()?;
    fluidity_data.serialize(&mut &mut data[..])?;

    Ok(())
}

fn update_payout_limit(
    accounts: &[AccountInfo],
    program_id: &Pubkey,
    limit: u64,
    seed: String,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let fluidity_data_account = next_account_info(accounts_iter)?;
    let token_mint = next_account_info(accounts_iter)?;
    let fluidity_mint = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let payer = next_account_info(accounts_iter)?;

    let data_seed = format!("FLU:{}_DATA", seed);
    if fluidity_data_account.key
        != &Pubkey::create_with_seed(pda_account.key, &data_seed, program_id).unwrap()
    {
        panic!("bad data account");
    }
    let mut fluidity_data = validate_fluidity_data_account(
        fluidity_data_account,
        *token_mint.key,
        *fluidity_mint.key,
        *pda_account.key,
    );

    if !(payer.is_signer && *payer.key == fluidity_data.large_payout_authority) {
        panic!("bad payout authority");
    }

    fluidity_data.block_payout_threshold = limit;

    // borrow the data and write
    let mut data = fluidity_data_account.try_borrow_mut_data()?;
    fluidity_data.serialize(&mut &mut data[..])?;

    Ok(())
}

fn update_payout_authority(
    accounts: &[AccountInfo],
    program_id: &Pubkey,
    new_authority: String,
    seed: String,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let fluidity_data_account = next_account_info(accounts_iter)?;
    let token_mint = next_account_info(accounts_iter)?;
    let fluidity_mint = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let payer = next_account_info(accounts_iter)?;

    let data_seed = format!("FLU:{}_DATA", seed);
    if fluidity_data_account.key
        != &Pubkey::create_with_seed(pda_account.key, &data_seed, program_id).unwrap()
    {
        panic!("bad data account");
    }
    let mut fluidity_data = validate_fluidity_data_account(
        fluidity_data_account,
        *token_mint.key,
        *fluidity_mint.key,
        *pda_account.key,
    );

    if !payer.is_signer {
        panic!("bad payout authority");
    }

    let new_authority_key = Pubkey::from_str(&new_authority).unwrap();

    if *payer.key == fluidity_data.payout_authority {
        fluidity_data.payout_authority = new_authority_key;
    } else if *payer.key == fluidity_data.large_payout_authority {
        fluidity_data.large_payout_authority = new_authority_key;
    } else {
        panic!("bad payout authority");
    }

    // borrow the data and write
    let mut data = fluidity_data_account.try_borrow_mut_data()?;
    fluidity_data.serialize(&mut &mut data[..])?;

    Ok(())
}

// initialise a data account derived from PDA that stores valid token pairs
fn init_data(
    accounts: &[AccountInfo],
    program_id: &Pubkey,
    seed: String,
    lamports: u64,
    space: u64,
    bump: u8,
    block_payout_threshold: u64,
    wrapping_enabled: bool,
    global_mint: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let system_program = next_account_info(accounts_iter)?;
    let payer = next_account_info(accounts_iter)?;
    let data_account = next_account_info(accounts_iter)?;
    let token_mint = next_account_info(accounts_iter)?;
    let fluid_mint = next_account_info(accounts_iter)?;
    let pda = next_account_info(accounts_iter)?;
    let payout_authority = next_account_info(accounts_iter)?;
    let large_payout_authority = next_account_info(accounts_iter)?;

    // check payout authority
    if !(payer.is_signer && payer.key == &Pubkey::from_str(INIT_AUTHORITY).unwrap()) {
        panic!("bad init authority!");
    }

    let pda_seed = format!("FLU:{}_OBLIGATION", seed);
    let data_seed = format!("FLU:{}_DATA", seed);

    // create the acccount
    invoke_signed(
        &system_instruction::create_account_with_seed(
            payer.key,
            data_account.key,
            pda.key,
            &data_seed,
            lamports,
            space,
            program_id,
        ),
        &[
            payer.clone(),
            data_account.clone(),
            pda.clone(),
            system_program.clone(),
        ],
        &[&[&pda_seed.as_bytes(), &[bump]]],
    )?;

    // borrow the data and write
    let mut data = data_account.try_borrow_mut_data()?;
    FluidityData {
        token_mint: *token_mint.key,
        fluid_mint: *fluid_mint.key,
        pda: *pda.key,
        payout_authority: *payout_authority.key,
        large_payout_authority: *large_payout_authority.key,
        block_payout_threshold,
        wrapping_enabled,
        global_mint_remaining: global_mint,
    }
    .serialize(&mut &mut data[..])?;

    Ok(())
}

// check that base mint, fluid mint, and pda match those specified in the data account
// before doing this, check that the data account is valid!
fn validate_fluidity_data_account(
    data_account: &AccountInfo,
    token_mint: Pubkey,
    fluid_mint: Pubkey,
    pda: Pubkey,
) -> FluidityData {
    // get fluidity data
    let data = data_account.try_borrow_data().unwrap();
    let fluidity_data = FluidityData::deserialize(&mut &data[..]).unwrap();

    // check that mints and pda are consistent
    if (
        fluidity_data.token_mint,
        fluidity_data.fluid_mint,
        fluidity_data.pda,
    ) != (token_mint, fluid_mint, pda)
    {
        panic!("bad mint or pda");
    }

    fluidity_data
}

pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], input: &[u8]) -> ProgramResult {
    let instruction = FluidityInstruction::try_from_slice(input)?;
    match instruction {
        FluidityInstruction::Wrap(amount, seed, bump) => {
            wrap(&accounts, program_id, amount, seed, bump)
        }
        FluidityInstruction::Unwrap(amount, seed, bump) => {
            unwrap(&accounts, program_id, amount, seed, bump)
        }
        FluidityInstruction::Payout(amount, seed, bump) => {
            payout(&accounts, amount, seed, bump, program_id)
        },
        FluidityInstruction::InitSolendObligation(
            obligation_lamports,
            obligation_size,
            seed,
            bump,
        ) => init_solend_obligation(&accounts, obligation_lamports, obligation_size, seed, bump),
        FluidityInstruction::LogTVL => log_tvl(&accounts, program_id),
        FluidityInstruction::InitData(
            seed,
            lamports,
            space,
            bump,
            block_payouts,
            wrap_enabled,
            global_mint,
        ) => {
            init_data(
                &accounts,
                program_id,
                seed,
                lamports,
                space,
                bump,
                block_payouts,
                wrap_enabled,
                global_mint,
            )
        },
        FluidityInstruction::MoveFromPrizePool(payout_amt, seed, bump) => {
            move_from_prize_pool(&accounts, payout_amt, seed, bump)
        },
        FluidityInstruction::UpdateMintLimit(limit, seed) => {
            update_mint_limit(&accounts, program_id, limit, seed)
        },
        FluidityInstruction::UpdatePayoutLimit(limit, seed) => {
            update_payout_limit(&accounts, program_id, limit, seed)
        },
        FluidityInstruction::UpdatePayoutAuthority(authority, seed) => {
            update_payout_authority(accounts, program_id, authority, seed)
        },
    }
}
