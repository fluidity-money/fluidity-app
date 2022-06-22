# microservice-solana-tribeca-create-proposal

Serializes and submits transactions to Tribeca governor

## Tribeca Listener Environment Variables

|            Name                  |                                 Description
|----------------------------------|---------------------------------------------------------------------------|
| `FLU_TRIBECA_GOVERNOR_PUBKEY`    | Pubkey of Tribeca governor                                                |
| `FLU_SOLANA_RPC_URL`             | Solana node RPC address to fetch transaction info from.                   |
| `FLU_TRIBECA_PROPOSAL_TITLE`     | Title of the proposal                                                     |
| `FLU_TRIBECA_PROPOSAL_DESC`      | Description of the proposal. Formatted in Markdown                        |
| `FLU_INSTRUCTION`                | Instruction to be called by Tribeca                                       |

### FLU_INSTRUCTION
- DRAIN_INSTRUCTION
- INITIALIZE_DATA_STORE
- CHANGE_DELTA
- CHANGE_PAYOUT_REQ
- CHANGE_NUM_REWARD_TIERS

## ADDITIONAL Fluidity Solana Instruction Environment Variables

|            Name                  |                                 Description
|----------------------------------|-------------------------------------------------------------------|
| `FLU_SOLANA_PROGRAM_ID`          | Pubkey of Fluidity Solana contract                                |
| `FLU_SOLANA_FLUID_MINT_PUBKEY`   | Pubkey of Fluidity Token Mint                                     |
| `FLU_SOLANA_TOKEN_NAME`          | Name of Fluidity token                                            |
| `FLU_SOLANA_OBLIGATION_PUBKEY`   | Pubkey of Fluidity Token Obligation                               |
| `FLU_SOLANA_RESERVE_PUBKEY`      | Pubkey of Fluidity Token Reserve                                  |
| `FLU_SOLANA_RECEIVER_PUBKEY`     | Pubkey of receiver from drain instruction                         |
| `FLU_SOLANA_PAYOUT_AMOUNT`       | Amount to send receiver from drain instruction                    |

## ADDITIONAL Tribeca Data Store Instruction Environment Variables

|            Name                       |                                 Description
|---------------------------------------|--------------------------------------------------------------|
| `FLU_TRF_DATA_STORE_PROGRAM_ID`       | Pubkey of Trf data store program                             |
| `FLU_TRF_DATA_STORE_SECRET_KEY`       | Authority of Trf data store contract                         |
| `FLU_TRIBECA_DATA_STORE_DELTA_NUM`    | New TRF delta weight numerator                               |
| `FLU_TRIBECA_DATA_STORE_DELTA_DENOM`  | New TRF delta weight denominator                             |
| `FLU_TRIBECA_DATA_STORE_FREQ_NUM`     | New TRF payout frequency numerator                           |
| `FLU_TRIBECA_DATA_STORE_FREQ_DENOM`   | New TRF payout frequency denominator                         |
| `FLU_TRIBECA_DATA_STORE_REWARD_TIERS` | New TRF reward tiers                                         |

## Running create proposal 
`npx ts-node microservice-solana-tribeca-create-proposal.ts`

