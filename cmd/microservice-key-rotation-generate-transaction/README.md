
# microservice-key-rotation-generate-transaction

Validates the output from microservice-key-rotation and generates a transaction
to update the worker config.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_ETHEREUM_KEY_ROTATION_LOG_PATH`                      | Path to the log file to load. |

## Building

    make build

## Testing

    make test

## Docker

    make docker
