use serde_json::from_str;
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    system_instruction,
};
use std::str::FromStr;

use crate::accounts::{ConfigOptions, FluidityInstruction, SolendAccounts};

pub struct WrapInstructionAccountMetas {
    fluidity_data_account: AccountMeta,
    token_program: AccountMeta,
    base_token_id: AccountMeta,
    fluid_token_id: AccountMeta,
    pda_pubkey: AccountMeta,
    payer_pubkey: AccountMeta,
    base_token_account: AccountMeta,
    fluid_token_account: AccountMeta,
    solend_program: AccountMeta,
    collateral_account: AccountMeta,
    reserve: AccountMeta,
    reserve_liquidity_supply: AccountMeta,
    collateral_mint: AccountMeta,
    lending_market: AccountMeta,
    market_authority: AccountMeta,
    collateral_supply: AccountMeta,
    obligation_account: AccountMeta,
    pyth_account: AccountMeta,
    switchboard_account: AccountMeta,
    clock_program: AccountMeta,
}

pub struct WrapInstructionArgs {
    amount: u64,
    token_name: String,
    bump_seed: u8,
}

pub struct UnwrapInstructionAccountMetas {
    fluidity_data_account: AccountMeta,
    token_program: AccountMeta,
    base_token_id: AccountMeta,
    fluid_token_id: AccountMeta,
    pda_pubkey: AccountMeta,
    payer_pubkey: AccountMeta,
    base_token_account: AccountMeta,
    fluid_token_account: AccountMeta,
    solend_program: AccountMeta,
    collateral_account: AccountMeta,
    reserve: AccountMeta,
    reserve_liquidity_supply: AccountMeta,
    collateral_mint: AccountMeta,
    lending_market: AccountMeta,
    market_authority: AccountMeta,
    collateral_supply: AccountMeta,
    obligation_account: AccountMeta,
    pyth_account: AccountMeta,
    switchboard_account: AccountMeta,
    clock_program: AccountMeta,
}

pub struct UnwrapInstructionArgs {
    amount: u64,
    token_name: String,
    bump_seed: u8,
}

pub struct PayoutInstructionAccountMetas {
    token_program: AccountMeta,
    fluid_token_id: AccountMeta,
    pda_pubkey: AccountMeta,
    obligation_account: AccountMeta,
    reserve: AccountMeta,
    fluid_token_account_a: AccountMeta,
    fluid_token_account_b: AccountMeta,
    payer_pubkey: AccountMeta,
}

pub struct PayoutInstructionArgs {
    amount: u64,
    token_name: String,
    bump_seed: u8,
}

pub struct MoveFromPrizePoolInstructionAccountMetas {
    token_program: AccountMeta,
    fluid_token_id: AccountMeta,
    pda_pubkey: AccountMeta,
    obligation_account: AccountMeta,
    reserve: AccountMeta,
    fluid_token_account: AccountMeta,
    payer_pubkey: AccountMeta,
}

pub struct MoveFromPrizePoolInstructionArgs {
    amount: u64,
    token_name: String,
    bump_seed: u8,
}

pub struct InitObligationInstructionAccountMetas {
    payer_pubkey: AccountMeta,
    collateral_mint: AccountMeta,
    solend_program: AccountMeta,
    system_program: AccountMeta,
    obligation_account: AccountMeta,
    lending_market: AccountMeta,
    pda_pubkey: AccountMeta,
    clock_program: AccountMeta,
    rent_program: AccountMeta,
    token_program: AccountMeta,
}

pub struct InitObligationInstructionArgs {
    lamports: u64,
    space: u64,
    bump_seed: u8,
    token_name: String,
}

pub struct LogTvlInstructionAccountMetas {
    tvl_data_pubkey: AccountMeta,
    payer_pubkey: AccountMeta,
    solend_program: AccountMeta,
    obligation_account: AccountMeta,
    reserve: AccountMeta,
    pyth_account: AccountMeta,
    switchboard_account: AccountMeta,
    clock_program: AccountMeta,
}

pub struct InitDataInstructionAccountMetas {
    system_program: AccountMeta,
    payer_pubkey: AccountMeta,
    data_pubkey: AccountMeta,
    token_mint: AccountMeta,
    fluid_mint: AccountMeta,
    pda_pubkey: AccountMeta,
}

pub struct InitDataInstructionArgs {
    token_name: String,
    lamports: u64,
    space: u64,
    bump_seed: u8,
}

pub struct InitTvlDataInstructionArgs {
    payer_pubkey: Pubkey,
    tvl_data_pubkey: Pubkey,
    lamports: u64,
    space: u64,
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
