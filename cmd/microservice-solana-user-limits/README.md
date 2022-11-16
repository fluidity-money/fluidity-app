
# Solana User Limits

Expose an API endpoint for webapp users to, for tokens on Solana, obtain the amount they've minted and the per-user limit for that token

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_POSTGRES_URI` | Database URI to use when connecting to the Postgres database. |

## Building

    make build

## Testing

    make test

## Docker

    make docker
