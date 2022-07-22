use serde_json::from_str;
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    system_instruction,
};
use std::str::FromStr;

use crate::accounts::{ConfigOptions, FluidityInstruction, SolendAccounts};

pub struct WrapInstructionAccountMetas {
    pub fluidity_data_account: AccountMeta,
    pub token_program: AccountMeta,
    pub base_token_id: AccountMeta,
    pub fluid_token_id: AccountMeta,
    pub pda_pubkey: AccountMeta,
    pub payer_pubkey: AccountMeta,
    pub base_token_account: AccountMeta,
    pub fluid_token_account: AccountMeta,
    pub solend_program: AccountMeta,
    pub collateral_account: AccountMeta,
    pub reserve: AccountMeta,
    pub reserve_liquidity_supply: AccountMeta,
    pub collateral_mint: AccountMeta,
    pub lending_market: AccountMeta,
    pub market_authority: AccountMeta,
    pub collateral_supply: AccountMeta,
    pub obligation_account: AccountMeta,
    pub pyth_account: AccountMeta,
    pub switchboard_account: AccountMeta,
    pub clock_program: AccountMeta,
}

pub struct WrapInstructionArgs {
    pub amount: u64,
    pub token_name: String,
    pub bump_seed: u8,
}

pub struct UnwrapInstructionAccountMetas {
    pub fluidity_data_account: AccountMeta,
    pub token_program: AccountMeta,
    pub base_token_id: AccountMeta,
    pub fluid_token_id: AccountMeta,
    pub pda_pubkey: AccountMeta,
    pub payer_pubkey: AccountMeta,
    pub base_token_account: AccountMeta,
    pub fluid_token_account: AccountMeta,
    pub solend_program: AccountMeta,
    pub collateral_account: AccountMeta,
    pub reserve: AccountMeta,
    pub reserve_liquidity_supply: AccountMeta,
    pub collateral_mint: AccountMeta,
    pub lending_market: AccountMeta,
    pub market_authority: AccountMeta,
    pub collateral_supply: AccountMeta,
    pub obligation_account: AccountMeta,
    pub pyth_account: AccountMeta,
    pub switchboard_account: AccountMeta,
    pub clock_program: AccountMeta,
}

pub struct UnwrapInstructionArgs {
    pub amount: u64,
    pub token_name: String,
    pub bump_seed: u8,
}

pub struct PayoutInstructionAccountMetas {
    pub token_program: AccountMeta,
    pub fluid_token_id: AccountMeta,
    pub pda_pubkey: AccountMeta,
    pub obligation_account: AccountMeta,
    pub reserve: AccountMeta,
    pub fluid_token_account_a: AccountMeta,
    pub fluid_token_account_b: AccountMeta,
    pub payer_pubkey: AccountMeta,
}

pub struct PayoutInstructionArgs {
    pub amount: u64,
    pub token_name: String,
    pub bump_seed: u8,
}

pub struct MoveFromPrizePoolInstructionAccountMetas {
    pub token_program: AccountMeta,
    pub fluid_token_id: AccountMeta,
    pub pda_pubkey: AccountMeta,
    pub obligation_account: AccountMeta,
    pub reserve: AccountMeta,
    pub fluid_token_account: AccountMeta,
    pub payer_pubkey: AccountMeta,
}

pub struct MoveFromPrizePoolInstructionArgs {
    pub amount: u64,
    pub token_name: String,
    pub bump_seed: u8,
}

#[derive(Debug)]
pub struct InitObligationInstructionAccountMetas {
    pub payer_pubkey: AccountMeta,
    pub collateral_mint: AccountMeta,
    pub solend_program: AccountMeta,
    pub system_program: AccountMeta,
    pub obligation_account: AccountMeta,
    pub lending_market: AccountMeta,
    pub pda_pubkey: AccountMeta,
    pub clock_program: AccountMeta,
    pub rent_program: AccountMeta,
    pub token_program: AccountMeta,
}

#[derive(Debug)]
pub struct InitObligationInstructionArgs {
    pub lamports: u64,
    pub space: u64,
    pub bump_seed: u8,
    pub token_name: String,
}


#[derive(Debug)]
pub struct LogTvlInstructionAccountMetas {
    pub tvl_data_pubkey: AccountMeta,
    pub payer_pubkey: AccountMeta,
    pub solend_program: AccountMeta,
    pub obligation_account: AccountMeta,
    pub reserve: AccountMeta,
    pub pyth_account: AccountMeta,
    pub switchboard_account: AccountMeta,
    pub clock_program: AccountMeta,
}


#[derive(Debug)]
pub struct InitDataInstructionAccountMetas {
    pub system_program: AccountMeta,
    pub payer_pubkey: AccountMeta,
    pub data_pubkey: AccountMeta,
    pub token_mint: AccountMeta,
    pub fluid_mint: AccountMeta,
    pub pda_pubkey: AccountMeta,
}


#[derive(Debug)]
pub struct InitDataInstructionArgs {
    pub token_name: String,
    pub lamports: u64,
    pub space: u64,
    pub bump_seed: u8,
}


#[derive(Debug)]
pub struct InitTvlDataInstructionArgs {
    pub payer_pubkey: Pubkey,
    pub tvl_data_pubkey: Pubkey,
    pub lamports: u64,
    pub space: u64,
}

pub struct FluidContract {
    pub program_id: Pubkey,
}

impl FluidContract {
    pub fn new(program_id: &str) -> Self {
        FluidContract {
            program_id: Pubkey::from_str(program_id).unwrap(),
        }
    }

    pub fn wrap(
        &self,
        accounts: WrapInstructionAccountMetas,
        args: WrapInstructionArgs,
    ) -> Vec<Instruction> {
        let fluidity_data_account = accounts.fluidity_data_account;
        let token_program = accounts.token_program;
        let base_token_id = accounts.base_token_id;
        let fluid_token_id = accounts.fluid_token_id;
        let pda_pubkey = accounts.pda_pubkey;
        let payer_pubkey = accounts.payer_pubkey;
        let base_token_account = accounts.base_token_account;
        let fluid_token_account = accounts.fluid_token_account;
        let solend_program = accounts.solend_program;
        let collateral_account = accounts.collateral_account;
        let reserve = accounts.reserve;
        let reserve_liquidity_supply = accounts.reserve_liquidity_supply;
        let collateral_mint = accounts.collateral_mint;
        let lending_market = accounts.lending_market;
        let market_authority = accounts.market_authority;
        let collateral_supply = accounts.collateral_supply;
        let obligation_account = accounts.obligation_account;
        let pyth_account = accounts.pyth_account;
        let switchboard_account = accounts.switchboard_account;
        let clock_program = accounts.clock_program;

        let amount = args.amount;
        let bump_seed = args.bump_seed;
        let token_name = args.token_name;

        vec![Instruction::new_with_borsh(
            self.program_id,
            &FluidityInstruction::Wrap(amount, token_name, bump_seed),
            vec![
                fluidity_data_account,
                token_program,
                base_token_id,
                fluid_token_id,
                pda_pubkey,
                payer_pubkey,
                base_token_account,
                fluid_token_account,
                solend_program,
                collateral_account,
                reserve,
                reserve_liquidity_supply,
                collateral_mint,
                lending_market,
                market_authority,
                collateral_supply,
                obligation_account,
                pyth_account,
                switchboard_account,
                clock_program,
            ],
        )]
    }

    pub fn unwrap(
        &self,
        accounts: UnwrapInstructionAccountMetas,
        args: UnwrapInstructionArgs,
    ) -> Vec<Instruction> {
        let fluidity_data_account = accounts.fluidity_data_account;
        let token_program = accounts.token_program;
        let base_token_id = accounts.base_token_id;
        let fluid_token_id = accounts.fluid_token_id;
        let pda_pubkey = accounts.pda_pubkey;
        let payer_pubkey = accounts.payer_pubkey;
        let base_token_account = accounts.base_token_account;
        let fluid_token_account = accounts.fluid_token_account;
        let solend_program = accounts.solend_program;
        let collateral_account = accounts.collateral_account;
        let reserve = accounts.reserve;
        let reserve_liquidity_supply = accounts.reserve_liquidity_supply;
        let collateral_mint = accounts.collateral_mint;
        let lending_market = accounts.lending_market;
        let market_authority = accounts.market_authority;
        let collateral_supply = accounts.collateral_supply;
        let obligation_account = accounts.obligation_account;
        let pyth_account = accounts.pyth_account;
        let switchboard_account = accounts.switchboard_account;
        let clock_program = accounts.clock_program;

        let amount = args.amount;
        let token_name = args.token_name;
        let bump_seed = args.bump_seed;

        vec![Instruction::new_with_borsh(
            self.program_id,
            &FluidityInstruction::Unwrap(amount, token_name, bump_seed),
            vec![
                fluidity_data_account,
                token_program,
                base_token_id,
                fluid_token_id,
                pda_pubkey,
                payer_pubkey,
                base_token_account,
                fluid_token_account,
                solend_program,
                collateral_account,
                reserve,
                reserve_liquidity_supply,
                collateral_mint,
                lending_market,
                market_authority,
                collateral_supply,
                obligation_account,
                pyth_account,
                switchboard_account,
                clock_program,
            ],
        )]
    }

    pub fn payout(
        &self,
        accounts: PayoutInstructionAccountMetas,
        args: PayoutInstructionArgs,
    ) -> Vec<Instruction> {
        let token_program = accounts.token_program;
        let fluid_token_id = accounts.fluid_token_id;
        let pda_pubkey = accounts.pda_pubkey;
        let obligation_account = accounts.obligation_account;
        let reserve = accounts.reserve;
        let fluid_token_account_a = accounts.fluid_token_account_a;
        let fluid_token_account_b = accounts.fluid_token_account_b;
        let payer_pubkey = accounts.payer_pubkey;

        let amount = args.amount;
        let token_name = args.token_name;
        let bump_seed = args.bump_seed;

        vec![Instruction::new_with_borsh(
            self.program_id,
            &FluidityInstruction::Payout(amount, token_name, bump_seed),
            vec![
                token_program,
                fluid_token_id,
                pda_pubkey,
                obligation_account,
                reserve,
                fluid_token_account_a,
                fluid_token_account_b,
                payer_pubkey,
            ],
        )]
    }

    pub fn move_from_prize_pool(
        &self,
        accounts: MoveFromPrizePoolInstructionAccountMetas,
        args: MoveFromPrizePoolInstructionArgs,
    ) -> Vec<Instruction> {
        let token_program = accounts.token_program;
        let fluid_token_id = accounts.fluid_token_id;
        let pda_pubkey = accounts.pda_pubkey;
        let obligation_account = accounts.obligation_account;
        let reserve = accounts.reserve;
        let fluid_token_account = accounts.fluid_token_account;
        let payer_pubkey = accounts.payer_pubkey;

        let amount = args.amount;
        let token_name = args.token_name;
        let bump_seed = args.bump_seed;

        vec![Instruction::new_with_borsh(
            self.program_id,
            &FluidityInstruction::MoveFromPrizePool(amount, token_name, bump_seed),
            vec![
                token_program,
                fluid_token_id,
                pda_pubkey,
                obligation_account,
                reserve,
                fluid_token_account,
                payer_pubkey,
            ],
        )]
    }

    pub fn initobligation(
        &self,
        accounts: InitObligationInstructionAccountMetas,
        args: InitObligationInstructionArgs,
    ) -> Vec<Instruction> {
        let payer_pubkey = accounts.payer_pubkey;
        let collateral_mint = accounts.collateral_mint;
        let solend_program = accounts.solend_program;
        let system_program = accounts.system_program;
        let obligation_account = accounts.obligation_account;
        let lending_market = accounts.lending_market;
        let pda_pubkey = accounts.pda_pubkey;
        let clock_program = accounts.clock_program;
        let rent_program = accounts.rent_program;
        let token_program = accounts.token_program;

        let lamports = args.lamports;
        let space = args.space;
        let bump_seed = args.bump_seed;
        let token_name = args.token_name;

        vec![
            spl_associated_token_account::create_associated_token_account(
                &payer_pubkey.pubkey,
                &pda_pubkey.pubkey,
                &collateral_mint.pubkey,
            ),
            Instruction::new_with_borsh(
                self.program_id,
                &FluidityInstruction::InitSolendObligation(lamports, space, token_name, bump_seed),
                vec![
                    payer_pubkey,
                    solend_program,
                    system_program,
                    obligation_account,
                    lending_market,
                    pda_pubkey,
                    clock_program,
                    rent_program,
                    token_program,
                ],
            ),
        ]
    }

    pub fn log_tvl(&self, accounts: LogTvlInstructionAccountMetas) -> Vec<Instruction> {
        let tvl_data_pubkey = accounts.tvl_data_pubkey;
        let payer_pubkey = accounts.payer_pubkey;
        let solend_program = accounts.solend_program;
        let obligation_account = accounts.obligation_account;
        let reserve = accounts.reserve;
        let pyth_account = accounts.pyth_account;
        let switchboard_account = accounts.switchboard_account;
        let clock_program = accounts.clock_program;

        vec![Instruction::new_with_borsh(
            self.program_id,
            &FluidityInstruction::LogTVL,
            vec![
                tvl_data_pubkey,
                payer_pubkey,
                solend_program,
                obligation_account,
                reserve,
                pyth_account,
                switchboard_account,
                clock_program,
            ],
        )]
    }

    pub fn init_data(
        &self,
        accounts: InitDataInstructionAccountMetas,
        args: InitDataInstructionArgs,
    ) -> Vec<Instruction> {
        let system_program = accounts.system_program;
        let payer_pubkey = accounts.payer_pubkey;
        let data_pubkey = accounts.data_pubkey;
        let token_mint = accounts.token_mint;
        let fluid_mint = accounts.fluid_mint;
        let pda_pubkey = accounts.pda_pubkey;

        let token_name = args.token_name;
        let lamports = args.lamports;
        let space = args.space;
        let bump_seed = args.bump_seed;

        vec![Instruction::new_with_borsh(
            self.program_id,
            &FluidityInstruction::InitData(token_name, lamports, space, bump_seed),
            vec![
                system_program,
                payer_pubkey,
                data_pubkey,
                token_mint,
                fluid_mint,
                pda_pubkey,
            ],
        )]
    }

    pub fn init_tvl_data(&self, args: InitTvlDataInstructionArgs) -> Vec<Instruction> {
        let payer_pubkey = args.payer_pubkey;
        let tvl_data_pubkey = args.tvl_data_pubkey;
        let lamports = args.lamports;
        let space = args.space;

        let tvl_data_seed = "FLU:TVL_DATA";

        vec![system_instruction::create_account_with_seed(
            &payer_pubkey,
            &tvl_data_pubkey,
            &payer_pubkey,
            &tvl_data_seed,
            lamports,
            space,
            &self.program_id,
        )]
    }
}
