
# solana-contract-test-client

Rust CLI for testing the Solana Fluidity factory program.

# Environment Variables

| Name                  | Description                                                          |
|-----------------------|----------------------------------------------------------------------|
| `SOLANA_NODE_ADDRESS` | The url of the target solana node.                                   |
| `SOLANA_ID_PATH`      | The path to a file containing a solana keypair                       |
| `SLND_COMMON`         | The path to a JSON file containing solend lending program addresses. |
| `FLU_PROGRAM_ID`      | The public key of the fluidity program.                              |
| `FLU_TOKEN_NAME`      | The name of the target token. (ie. USDC)                             |
| `FLU_TOKEN_MINT`      | The public key of the target token's mint.                           |
| `FLU_FLUID_MINT`      | The public key of the fluid token's mint.                            |

## Optional

| Name                 | Description                                                                                                                           |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `FLU_TOKEN_SOURCE`   | The account to withdraw/deposit the target tokens from/to.                                                                            |
| `FLU_FLUID_ACCOUNT`  | The account to withdraw/deposit fluid tokens from/tio.                                                                                |
| `FLU_PDA_OBLIGATION` | The program derived account's solend obligation account.                                                                              |
| `FLU_PDA_COLLATERAL` | The program derived account's solend collateral account.                                                                              |
| `FLU_SIMULATE`       | A flag to tell the program to simulate the transaction instead of submitting it to the chain. Set to "true" if simulation is desired. |

## Building

    make build

or

    cargo build

## Getting started

1. Deploy contract to Devnet. Make sure AUTHORITY matches the payer / deployer, and SOLEND is the Devnet contract

2. Create new token

    spl-token create-token
    
3. Configure run script to include Contract, Fluid Token Mint, Base Token Mint (See #Environment Variables)

4. Set PDA account as Mint Authority
  -     PDA_ACC = ./run.sh dumpallkeys | grep -e 'pda_pubkey' | awk 'print {$2}'
  -     spl-token authorize <TOKEN> mint <PDA_ACC>

5. Initialize utility accounts
  -     ./run.sh initobligation 
  -     ./run.sh initdata 

## Testing

### For each test account, make sure to run Initialize before wrapping / unwrapping
    ./run.sh inittvldata

    cargo run [commands]
    
or run the binary located in `target/debug`

### Commands

| Name                         | Description                                                                    |
|------------------------------|--------------------------------------------------------------------------------|
| `wrap [amount]`              | Wraps `[amount]` of the base token, converting it into fluid tokens.           |
| `unwrap [amount]`            | Unwraps `[amount]` of the fluid token, converting it back into the base token. |
| `payout [amount]`            | Pays `[amount]` of the fluid token from liquidity pool, moving 8/10 to \\AccountA,
 and 2/10 to AccountB. Only callable by AUTHORITY |
| `movefromprizepool [amount]` | Pays `[amount]` of the fluid token, to AccountA. Only callable by AUTHOIRITY   |
| `initobligation`             | Initialise the obligation account.                                             |
| `initdata`                   | Initialise the data account.                                                   |
| `inittvldata`                | Initialise the tvl data account.                                               |
| `printpdakeys`               | Prints the program derived account's pubkey keys and seeds.                    |
| `dumpallkeys`                | Prints the current config pubkey and derived PDA keys                          |
| `help`                       | Prints a help message.                                                         |
