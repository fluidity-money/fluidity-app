# ☀ Solana program architecture

Solana is built as a program that derives new accounts for its supported tokens.

<figure><img src="https://fluidity.money/gitbook-content/solana-architecture.png" alt=""><figcaption><p>Solana architecture simplified</p></figcaption></figure>

Each account's layout can be read at [Solana **** account structure](../solana-account-structure.md).&#x20;

The program supports the following instructions:

```rust
// wrap fluid token
Wrap(u64, String, u8),

// unwrap fluid token
Unwrap(u64, String, u8),

// payout two accounts
Payout(u64, String, u8),

// initialise solend obligation account
InitSolendObligation(u64, u64, String, u8),

LogTVL,

// initialise the data account for this token
InitData(String, u64, u64, u8, u64, u64),

// move from prize pool to account
MoveFromPrizePool(u64, String, u8),

// update mint limit to an amount
UpdateMintLimit(u64, String),

// update the payout restriction limit
UpdatePayoutLimit(u64, String),

// update the payout authortity (the rng oracle)
UpdatePayoutAuthority(String),

// update the operator (the multisig)
UpdateOperator(String),

// confirm the payout authority in the two step replacement process
ConfirmUpdatePayoutAuthority(String),

// trigger emergency mode
Emergency(String)
```

### Features in pseudocode form

#### Wrapping in (Wrap)

1. Using Solend, the program deposits the user's given amount as liquidity
2. The program determines the collateral account from Solend
3. The program stores the collateral in the obligation account for the token
4. Using the SPL token, user tokens are minted proportionate to the amount deposited

#### Wrapping out (Unwrap)

1. Contract burns the user's SPL tokens
2. Refreshes the Solend reserve
3. Calculates the Solend collateral amount in the obligation account
4. Withdraws from Solend to the user's token account
