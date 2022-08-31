
# fluidity-solana

Fluidity solana implementation. Implements a "factory" for distributing
fluid tokens.

## Building

	make build

Ensure that solana environment is correctly set up.

## Deploy

	make deploy

Ensure that solana environment is correctly set up.

## Wrap(amount, token\_name, bump\_seed)

Wrap an amount of one token into the equivalent amount of its fluid
analog. Requires the name of the token to be provided in upper case,
as well as the bump seed of the program's derived obligation authority
account for that token.

### Accounts

| Name                            | Description                                                                       |
|---------------------------------|-----------------------------------------------------------------------------------|
| `fluidity_data_account`         | The data account holding valid token pairs. Must be derived from the pda account. |
| `token_program`                 | The spl-token program.                                                            |
| `token_mint`                    | The mint of the token being wrapped.                                              |
| `fluidity_mint`                 | The mint of the fluid token.                                                      |
| `pda_account`                   | The obligation authority account for the target token, derived from this program.            |
| `sender`                        | The transaction sender.                                                           |
| `token_account`                 | The sender's token account for the token being wrapped.                           |
| `fluidity_account`              | The sender's token account for the fluid token.                                   |
| `solend_program`                | The solend lending program.                                                       |
| `collateral_info`               | The PDA account's solend collateral info.                                         |
| `reserve_info`                  | The associated solend reserve.                                                    |
| `reserve_liquidity_supply_info` | The associated reserve's liquidity supply account.                                |
| `reserve_collateral_mint_info`  | The associated solend collateral mint.                                            |
| `lending_market_info`           | The associated solend lending market.                                             |
| `lending_market_authority`      | The associated authority for the lending market.                                  |
| `destination_collateral_info`   | The associated solend collateral account.                                         |
| `obligation_info`               | The PDA account's obligation account.                                             |
| `pyth_price_feed_info`          | The associated pyth price feed.                                                   |
| `switchboard_feed_info`         | The associated switchboard feed.                                                  |
| `clock_info`                    | The Solana clock sysvar.                                                          |

## Unwrap(amount, token\_name, bump\_seed)

Unwrap an amount of a fluid token and receive the equivalent amount of its
base token. Requires the name of the token to be provided in upper case,
as well as the bump seed of the program's derived obligation authority
account for that token.

### Accounts

| Name                            | Description                                                                       |
|---------------------------------|-----------------------------------------------------------------------------------|
| `fluidity_data_account`         | The data account holding valid token pairs. Must be derived from the pda account. |
| `token_program`                 | The spl-token program.                                                            |
| `token_mint`                    | The mint of the token being unwrapped.                                            |
| `fluidity_mint`                 | The mint of the fluid token.                                                      |
| `pda_account`                   | The obligation account authority for the target token, derived from this program.            |
| `sender`                        | The transaction sender.                                                           |
| `token_account`                 | The sender's token account for the token being unwrapped.                         |
| `fluidity_account`              | The sender's token account for the fluid token.                                   |
| `solend_program`                | The solend lending program.                                                       |
| `collateral_info`               | The PDA account's solend collateral info.                                         |
| `reserve_info`                  | The associated solend reserve.                                                    |
| `reserve_liquidity_supply_info` | The associated reserve's liquidity supply account.                                |
| `reserve_collateral_mint_info`  | The associated solend collateral mint.                                            |
| `lending_market_info`           | The associated solend lending market.                                             |
| `lending_market_authority`      | The associated authority for the lending market.                                  |
| `deposited_collateral_info`     | The associated solend collateral account.                                         |
| `obligation_info`               | The PDA account's obligation account.                                             |
| `pyth_price_feed_info`          | The associated pyth price feed.                                                   |
| `switchboard_feed_info`         | The associated switchboard feed.                                                  |
| `clock_info`                    | The Solana clock sysvar.                                                          |

## Payout (amount, token\_name, bump\_seed)

Payout two accounts by minting an amount of the token into both token
accounts. Requires the name of the token to be provided in upper case,
as well as the bump seed of the program's derived obligation authority
account for that token.

### Accounts

| Name               | Description                                                                       |
|--------------------|-----------------------------------------------------------------------------------|
| `token_program`    | The spl-token program.                                                            |
| `fluidity_mint`    | The mint of the fluid token.                                                      |
| `pda_account`      | The obligation authority account for the target token, derived from this program. |
| `payout_account_a` | One of the fluidity token accounts to mint to.                                    |
| `payout_account_b` | One of the fluidity token accounts to mint to.                                    |
| `payer`            | The sender of the transaction. Must match authorised authority.                   |

## InitSolendObligation (obligation\_lamports, obigation\_size, token\_name, bump\_seed)

Initialise a solend obligation owned by this program's derived account
for the specified token. Requires the name of the token to be provided in
upper case, as well as the bump seed of the program's derived obligation
authority account for that token.

### Accounts

| Name                    | Description                                                |
|-------------------------|------------------------------------------------------------|
| `payer`                 | The sender of the transaction.                             |
| `solend_program`        | The solend lending program.                                |
| `system_program`        | The Solana system program.                                 |
| `obligation_info`       | The obligation being initialised                           |
| `obligation_owner_info` | The account to own the obligation (solend market account). |
| `clock_info`            | The Solana clock sysvar.                                   |
| `rent_info`             | The Solana rent sysvar.                                    |
| `token_program`         | The spl-token program.                                     |

## LogTVL

Log the current value of assets held by the factory into a data account.

### Accounts

| Name                    | Description                                                                          |
|-------------------------|--------------------------------------------------------------------------------------|
| `data_account`          | The account to log the tvl into. Must be writeable by this program.                  |
| `base`                  | The account that the data_account is derived from.                                   |
| `fluidity_mint`         | NOT CURRENTLY USED! The mint of the fluid token. Used to get correct decimal places. |
| `solend_program`        | The solend lending program.                                                          |
| `obligation_info`       | The PDA account's obligation account.                                                |
| `reserve_info`          | The associated solend reserve.                                                       |
| `pyth_price_feed_info`  | The associated pyth price feed.                                                      |
| `switchboard_feed_info` | The associated switchboard feed.                                                     |
| `clock_info`            | The Solana clock sysvar.                                                             |

## InitData(token\_name, lamports, space, bump\_seed)

Initialise a data account that holds authorised pairs. Requires the name
of the token to be provided in upper case, as well as the bump seed of
the program's derived obligation authority account for that token.

### Accounts

| Name             | Description                                                                                 |
|------------------|---------------------------------------------------------------------------------------------|
| `system_program` | The Solana system program.                                                                  |
| `payer`          | The sender of the transaction.                                                              |
| `program`        | This program.                                                                               |
| `data_account`   | The data account being initialised. Must be derived from the pda and owned by this program. |
| `token_mint`     | The base token of the authorised pair.                                                      |
| `fluid_mint`     | The fluid token of the authorised pair.                                                     |
| `pda`            | The obligation authority account for the target token, derived from this program.           |

## Testing

### Installing Testing Dependencies

#### Cargo Fuzz
	cargo install cargo-fuzz

### Run a test validator with deployed contracts

	make run-test-validator
