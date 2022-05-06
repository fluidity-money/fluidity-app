# Tribeca-data-store

Holds:
- Contract changing TRF values for Solana worker
- Listeners to Tribeca
- Tribeca proposal creator

## Tribeca Listener Environment Variables

|            Name                  |                                 Description
|----------------------------------|---------------------------------------------------------------------------|
| `SECRET_KEY`                     | Payer secret key as B64. Should be a member of Tribeca executive council  |
| `FLU_TRIBECA_GOVERNOR_PUBKEY`    | Pubkey of Tribeca governor                                                |
| `FLU_TRIBECA_LOCKER_PUBKEY`      | Pubkey of Tribeca locker                                                  |
| `FLU_TRIBECA_SMART_WALLET_PUBKEY`| Pubkey of Tribeca smart wallet                                            |
| `FLU_TRIBECA_EXEC_COUNCIL_PUBKEY`| Pubkey of Tribeca multi-sig wallet SECRET_KEY is part of                  |
| `FLU_SOLANA_RPC_URL`             | Solana node RPC address to fetch transaction info from.                   |

## Building Tribeca listener
`make docker`

