// instruction types

use borsh::{BorshDeserialize, BorshSerialize};

// fluidity instructions
// enum for processes executable by fluidity smart contract
#[derive(BorshDeserialize, BorshSerialize, Debug, PartialEq, Clone)]
pub enum FluidityInstruction {
    // wrap fluid token
    Wrap(u64, String, u8),
    // unwrap fluid token
    Unwrap(u64, String, u8),
    // payout two accounts
    Payout(u64, String, u8),
    // initialise solend obligation account
    InitSolendObligation(u64, u64, String, u8),
    LogTVL,
    InitData(String, u64, u64, u8, u64, bool, u64),
    // move from prize pool to account
    MoveFromPrizePool(u64, String, u8),
    UpdateMintLimit(u64, String),
    UpdatePayoutLimit(u64, String),
    UpdatePayoutAuthority(String, String),
}

// solend instructions
#[derive(BorshSerialize)]
pub enum LendingInstruction {
    InitLendingMarket,

    SetLendingMarketOwner,

    InitReserve,

    RefreshReserve,

    DepositReserveLiquidity {
        liquidity_amount: u64,
    },

    RedeemReserveCollateral,

    // 6
    /// Initializes a new lending market obligation.
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writable]` Obligation account - uninitialized.
    ///   1. `[]` Lending market account.
    ///   2. `[signer]` Obligation owner.
    ///   3. `[]` Clock sysvar.
    ///   4. `[]` Rent sysvar.
    ///   5. `[]` Token program id.
    InitObligation,

    RefreshObligation,

    DepositObligationCollateral {
        collateral_amount: u64,
    },

    WithdrawObligationCollateral,

    BorrowObtaigationLiquidity,

    RepayObligationLiquidity,

    LiquidateObligation,

    FlashLoan,

    // 14
    /// Combines DepositReserveLiquidity and DepositObligationCollateral
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writable]` Source liquidity token account.
    ///                     $authority can transfer $liquidity_amount.
    ///   1. `[writable]` Destination collateral token account.
    ///   2. `[writable]` Reserve account.
    ///   3. `[writable]` Reserve liquidity supply SPL Token account.
    ///   4. `[writable]` Reserve collateral SPL Token mint.
    ///   5. `[]` Lending market account.
    ///   6. `[]` Derived lending market authority.
    ///   7. `[writable]` Destination deposit reserve collateral supply SPL Token account.
    ///   8. `[writable]` Obligation account.
    ///   9. `[signer]` Obligation owner.
    ///   10 `[]` Pyth price oracle account.
    ///   11 `[]` Switchboard price feed oracle account.
    ///   12 `[signer]` User transfer authority ($authority).
    ///   13 `[]` Clock sysvar.
    ///   14 `[]` Token program id.
    DepositReserveLiquidityAndObligationCollateral {
        /// Amount of liquidity to deposit in exchange
        liquidity_amount: u64,
    },

    // 15
    /// Combines WithdrawObligationCollateral and RedeemReserveCollateral
    ///
    /// Accounts expected by this instruction:
    ///
    ///   0. `[writable]` Source withdraw reserve collateral supply SPL Token account.
    ///   1. `[writable]` Destination collateral token account.
    ///                     Minted by withdraw reserve collateral mint.
    ///   2. `[writable]` Withdraw reserve account - refreshed.
    ///   3. `[writable]` Obligation account - refreshed.
    ///   4. `[]` Lending market account.
    ///   5. `[]` Derived lending market authority.
    ///   6. `[writable]` User liquidity token account.
    ///   7. `[writable]` Reserve collateral SPL Token mint.
    ///   8. `[writable]` Reserve liquidity supply SPL Token account.
    ///   9. `[signer]` Obligation owner
    ///   10 `[signer]` User transfer authority ($authority).
    ///   11. `[]` Clock sysvar.
    ///   12. `[]` Token program id.
    WithdrawObligationCollateralAndRedeemReserveCollateral {
        /// liquidity_amount is the amount of collateral tokens to withdraw
        collateral_amount: u64,
    },
}
