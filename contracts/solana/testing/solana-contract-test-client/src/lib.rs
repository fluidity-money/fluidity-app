use std::str::FromStr;
use std::sync::Once;

use accounts::{ConfigOptions, SolendAccounts};
use borsh::BorshDeserialize;
use rpc::send_txn;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    account::Account,
    account_info::IntoAccountInfo,
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::Keypair,
    signer::Signer,
    system_instruction, system_program, sysvar,
    transaction::Transaction,
};

use crate::accounts::{DevnetAccount, FluidityData};
use crate::instructions::*;

pub mod accounts;
pub mod instructions;
pub mod rpc;

static INIT: Once = Once::new();

#[derive(Debug)]
pub enum TestingCommands {
    Wrap(u64),
    Unwrap(u64),
    Payout(u64),
    MoveFromPrizePool(u64),
    InitObligation,
    LogTvl,
    InitData,
    InitTvlData,
    Help,
    PrintPdaKeys,
    DumpKeys,
}

pub fn send_instruction(
    client: &RpcClient,
    instructions: &Vec<Instruction>,
    payer: Pubkey,
    signers: Vec<&Keypair>,
) -> Result<Vec<String>, String> {
    // get recent blockhash
    let recent_blockhash = client.get_latest_blockhash().unwrap();

    let mut txn = Transaction::new_with_payer(instructions, Some(&payer));
    txn.sign(&signers, recent_blockhash);

    send_txn(&client, txn)
}

pub fn setup_accs(client: &RpcClient, config: &ConfigOptions, solend_accounts: &SolendAccounts, fluid_contract: &FluidContract) {
        INIT.call_once(|| {
    let payer = &config.accounts[0];

    let market = &solend_accounts.markets[0];

    let mint_account_seed = format!("FLU:{}_OBLIGATION", config.token_name);
    let (_, bump_seed) = Pubkey::find_program_address(
        &[mint_account_seed.as_bytes()],
        &Pubkey::from_str(&config.program_id).unwrap(),
    );

    // init obligation
    let init_obligation_accs = InitObligationInstructionAccountMetas {
        payer_pubkey: AccountMeta::new(payer.get_public_key(), true),
        collateral_mint: AccountMeta::new(accounts::collateral_mint(&config, &solend_accounts), true),
        solend_program: AccountMeta::new_readonly(accounts::solend_program(&solend_accounts), false),
        system_program: AccountMeta::new_readonly(system_program::ID, false),
        obligation_account: AccountMeta::new(accounts::obligation_account(&config), false),
        lending_market: AccountMeta::new(Pubkey::from_str(&market.address).unwrap(), false),
        pda_pubkey: AccountMeta::new(accounts::pda(&config), false),
        clock_program: AccountMeta::new_readonly(sysvar::clock::ID, false),
        rent_program: AccountMeta::new_readonly(sysvar::rent::ID, false),
        token_program: AccountMeta::new_readonly(spl_token::ID, false),
    };


    let init_obligation_args = instructions::InitObligationInstructionArgs {
        token_name: config.token_name.clone(),
        bump_seed,
        space: 1300,
        lamports: client
            .get_minimum_balance_for_rent_exemption(1300)
            .unwrap(),
    };

    let init_obligation_inst =
        fluid_contract.initobligation(init_obligation_accs, init_obligation_args);

    dbg!(send_instruction(
        &client,
        &init_obligation_inst,
        payer.get_public_key(),
        vec![&payer.keypair.as_ref().unwrap()]
    ));

    // Init data
    let init_data_accs = InitDataInstructionAccountMetas {
        system_program: AccountMeta::new_readonly(system_program::ID, false),
        payer_pubkey: AccountMeta::new(payer.get_public_key(), false),
        data_pubkey: AccountMeta::new(accounts::data_account(&config), false),
        token_mint: AccountMeta::new(accounts::base_token(&config, &solend_accounts), false),
        fluid_mint: AccountMeta::new(accounts::fluid_token(&config), false),
        pda_pubkey: AccountMeta::new(accounts::pda(&config), false),
    };

    let init_data_args = InitDataInstructionArgs {
        token_name: config.token_name.clone(),
        bump_seed,
        space: std::mem::size_of::<FluidityData>() as u64,
        lamports: client
            .get_minimum_balance_for_rent_exemption(std::mem::size_of::<FluidityData>())
            .unwrap(),
    };

    let init_data_inst = fluid_contract.init_data(init_data_accs, init_data_args);

    dbg!(send_instruction(
        &client,
        &init_data_inst,
        payer.get_public_key(),
        vec![&payer.keypair.as_ref().unwrap()]
    ));

    })
}

pub fn setup_user(client: &RpcClient, user: &DevnetAccount, fluid_contract: &FluidContract) {
        // Init tvl data
        let init_tvl_data_args = InitTvlDataInstructionArgs {
            payer_pubkey: user.get_public_key(),
            tvl_data_pubkey: user.tvl_data_account.unwrap(),
            space: std::mem::size_of::<u64>() as u64,
            lamports: client
                .get_minimum_balance_for_rent_exemption(std::mem::size_of::<u64>())
                .unwrap(),
        };

        let init_tvl_data_inst = fluid_contract.init_tvl_data(init_tvl_data_args);

        dbg!(send_instruction(
            &client,
            &init_tvl_data_inst,
            user.get_public_key(),
            vec![&user.keypair.as_ref().unwrap()]
        ));

}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_wrap_and_unwrap() {
        let mut config = ConfigOptions::new();

        let solend_accounts = SolendAccounts::new(&config.solend_account_file);

        config.derive_solend_accounts(&solend_accounts);

        let client = RpcClient::new(config.solana_node_address.clone());

        let fluid_contract = FluidContract::new(&config.program_id);

        let mint_account_seed = format!("FLU:{}_OBLIGATION", config.token_name);
        let (_, bump_seed) = Pubkey::find_program_address(
            &[mint_account_seed.as_bytes()],
            &Pubkey::from_str(&config.program_id).unwrap(),
        );
        
        setup_accs(&client, &config, &solend_accounts, &fluid_contract);

        // Wrap
        let wrapping_user = &config.accounts[5];
        
        setup_user(&client, &wrapping_user, &fluid_contract);

        let starting_fluid_token_amount = client
            .get_token_account_balance(&wrapping_user.fluid_token_account.unwrap())
            .unwrap();

        let starting_base_token_amount = client
            .get_token_account_balance(&wrapping_user.base_token_account.unwrap())
            .unwrap();

        let wrap_accs = WrapInstructionAccountMetas {
            fluidity_data_account: AccountMeta::new(accounts::data_account(&config), false),
            token_program: AccountMeta::new_readonly(spl_token::ID, false),
            base_token_id: AccountMeta::new(accounts::base_token(&config, &solend_accounts), false),
            fluid_token_id: AccountMeta::new(accounts::fluid_token(&config), false),
            pda_pubkey: AccountMeta::new(accounts::pda(&config), false),
            payer_pubkey: AccountMeta::new(wrapping_user.get_public_key(), true),
            base_token_account: AccountMeta::new(wrapping_user.base_token_account.unwrap(), false),
            fluid_token_account: AccountMeta::new(
                wrapping_user.fluid_token_account.unwrap(),
                false,
            ),
            solend_program: AccountMeta::new_readonly(
                accounts::solend_program(&solend_accounts),
                false,
            ),
            collateral_account: AccountMeta::new(accounts::collateral_account(&config), false),
            reserve: AccountMeta::new(accounts::reserve(&config, &solend_accounts), false),
            reserve_liquidity_supply: AccountMeta::new(
                accounts::reserve_liquidity(&config, &solend_accounts),
                false,
            ),
            collateral_mint: AccountMeta::new(
                accounts::collateral_mint(&config, &solend_accounts),
                false,
            ),
            lending_market: AccountMeta::new(accounts::lending_market(&solend_accounts), false),
            market_authority: AccountMeta::new_readonly(
                accounts::market_authority(&solend_accounts),
                false,
            ),
            collateral_supply: AccountMeta::new(
                accounts::collateral_supply(&config, &solend_accounts),
                false,
            ),
            obligation_account: AccountMeta::new(accounts::obligation_account(&config), false),
            pyth_account: AccountMeta::new(
                accounts::pyth_account(&config, &solend_accounts),
                false,
            ),
            switchboard_account: AccountMeta::new(
                accounts::switchboard_account(&config, &solend_accounts),
                false,
            ),
            clock_program: AccountMeta::new_readonly(sysvar::clock::ID, false),
        };

        let wrap_amt = 5;

        let wrap_args = WrapInstructionArgs {
            amount: wrap_amt,
            token_name: config.token_name.clone(),
            bump_seed,
        };

        let wrap_inst = fluid_contract.wrap(wrap_accs, wrap_args);

        let unwrap_accs = UnwrapInstructionAccountMetas {
            fluidity_data_account: AccountMeta::new(accounts::data_account(&config), false),
            token_program: AccountMeta::new_readonly(spl_token::ID, false),
            base_token_id: AccountMeta::new(accounts::base_token(&config, &solend_accounts), false),
            fluid_token_id: AccountMeta::new(accounts::fluid_token(&config), false),
            pda_pubkey: AccountMeta::new(accounts::pda(&config), false),
            payer_pubkey: AccountMeta::new(wrapping_user.get_public_key(), true),
            base_token_account: AccountMeta::new(wrapping_user.base_token_account.unwrap(), false),
            fluid_token_account: AccountMeta::new(
                wrapping_user.fluid_token_account.unwrap(),
                false,
            ),
            solend_program: AccountMeta::new_readonly(
                accounts::solend_program(&solend_accounts),
                false,
            ),
            collateral_account: AccountMeta::new(accounts::collateral_account(&config), false),
            reserve: AccountMeta::new(accounts::reserve(&config, &solend_accounts), false),
            reserve_liquidity_supply: AccountMeta::new(
                accounts::reserve_liquidity(&config, &solend_accounts),
                false,
            ),
            collateral_mint: AccountMeta::new(
                accounts::collateral_mint(&config, &solend_accounts),
                false,
            ),
            lending_market: AccountMeta::new(accounts::lending_market(&solend_accounts), false),
            market_authority: AccountMeta::new_readonly(
                accounts::market_authority(&solend_accounts),
                false,
            ),
            collateral_supply: AccountMeta::new(
                accounts::collateral_supply(&config, &solend_accounts),
                false,
            ),
            obligation_account: AccountMeta::new(accounts::obligation_account(&config), false),
            pyth_account: AccountMeta::new_readonly(
                accounts::pyth_account(&config, &solend_accounts),
                false,
            ),
            switchboard_account: AccountMeta::new_readonly(
                accounts::switchboard_account(&config, &solend_accounts),
                false,
            ),
            clock_program: AccountMeta::new_readonly(sysvar::clock::ID, false),
        };

        // Unwrap the same amount as wrapped
        let unwrap_args = UnwrapInstructionArgs {
            amount: wrap_amt,
            token_name: config.token_name.clone(),
            bump_seed,
        };

        let unwrap_inst = fluid_contract.unwrap(unwrap_accs, unwrap_args);

        assert!(dbg!(send_instruction(
            &client,
            &wrap_inst,
            wrapping_user.get_public_key(),
            vec![&wrapping_user.keypair.as_ref().unwrap()]
        ))
        .is_ok());

        let wrapped_fluid_token_amount = client
            .get_token_account_balance(&wrapping_user.fluid_token_account.unwrap())
            .unwrap();

        let wrapped_base_token_amount = client
            .get_token_account_balance(&wrapping_user.base_token_account.unwrap())
            .unwrap();

        assert_eq!(
            starting_fluid_token_amount.amount.parse::<u64>().unwrap() + wrap_amt,
            wrapped_fluid_token_amount.amount.parse::<u64>().unwrap()
        );

        assert_eq!(
            starting_base_token_amount.amount.parse::<u64>().unwrap() - wrap_amt,
            wrapped_base_token_amount.amount.parse::<u64>().unwrap()
        );

        assert!(dbg!(send_instruction(
            &client,
            &unwrap_inst,
            wrapping_user.get_public_key(),
            vec![&wrapping_user.keypair.as_ref().unwrap()]
        ))
        .is_ok());

        let unwrapped_fluid_token_amount = client
            .get_token_account_balance(&wrapping_user.fluid_token_account.unwrap())
            .unwrap();

        let unwrapped_base_token_amount = client
            .get_token_account_balance(&wrapping_user.base_token_account.unwrap())
            .unwrap();

        assert_eq!(
            starting_fluid_token_amount.amount.parse::<u64>().unwrap() + wrap_amt,
            unwrapped_fluid_token_amount.amount.parse::<u64>().unwrap()
        );

        assert_eq!(
            starting_base_token_amount.amount.parse::<u64>().unwrap() - wrap_amt,
            unwrapped_base_token_amount.amount.parse::<u64>().unwrap()
        );
    }
}
