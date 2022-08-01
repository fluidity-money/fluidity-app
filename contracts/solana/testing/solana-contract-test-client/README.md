
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

## Running

    ./run.sh

## Getting started

1. Deploy contract to Devnet. Make sure AUTHORITY matches the payer / deployer, and SOLEND is the Devnet contract

2. Create new token

    spl-token create-token
    
3. Configure run script to include Contract, Fluid Token Mint, Base Token Mint (See #Environment Variables)

