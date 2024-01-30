
# connector-sui-amqp

An all-in-one connector for reading events from the Sui blockchain to be processed by the worker and database infrastructure.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `ENV_SUI_WS_URL`             | URL of the Sui RPC Websocket for event subscription.                         |

## Building

    make build

## Testing

    make test

## Docker

    make docker
