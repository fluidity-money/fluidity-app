
# microservice-key-rotation

AWS Lambda function responsible for updating the Fluidity contract oracle addresses. Generates the keys, updates AWS parameters, then pushes a log to S3. For each token, the log contains `previousKey.Sign(newAddress)`, where `newAddress` is a 20 byte address that's been left padded with zeros to be 32 bytes long. Additionally creates and signs transactions to transfer the Ether balance from the old to new oracles, then uploads them internally to Discord.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`       | Worker ID used to identify the application in logging |
| `FLU_DEBUG`           | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_ETHEREUM_HTTP_URL` | HTTP address to use to connect to Geth. |
| `FLU_AWS_REGION` | Region to connect to AWS in (usually `ap-southeast-2`) |
| `FLU_AWS_CLUSTER` | AWS Cluster to restart services in |
| `FLU_AWS_SERVICE` | String to match against AWS services to be restarted (matched with `strings.Contains`) |
| `FLU_ORACLE_BUCKET_NAME` | S3 Bucket to place the signed transaction in |
| `FLU_ORACLE_UPDATE_LIST` | Comma-separated list of AWS parameters containing oracles that need to be updated with their contract addresses, of the form `contract1:param1,contract2:param2,...` |
| `FLU_DISCORD_WEBHOOK`      | Discord webhook to use when the Discord Notify function is used.             |

## Building

    make build

## Testing

    make test

## Docker

    make docker
