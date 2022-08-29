
# microservice-key-rotation

AWS Lambda function responsible for updating the Fluidity contract oracle addresses. Generates the keys and updates AWS parameters, then creates and signs a transaction which is uploaded to an S3 bucket for manual approval from the Fluidity multisig.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`       | Worker ID used to identify the application in logging |
| `FLU_DEBUG`           | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_ETHEREUM_HTTP_URL` | HTTP address to use to connect to Geth. |
| `FLU_AWS_REGION` | Region to connect to AWS in (usually `ap-southeast-2`) |
| `FLU_ORACLE_BUCKET_NAME` | S3 Bucket to place the signed transaction in |
| `FLU_ORACLE_UPDATE_LIST` | Comma-separated list of AWS parameters containing oracles that need to be updated with their contract addresses, of the form `param1:contract1,param2:contract2,...` |
| `FLU_WORKER_CONFIG_PRIVATE_KEY` | The private key that signs the transaction to update the oracles | 
| `FLU_WORKER_CONFIG_CONTRACT_ADDRESS` | The address of the `workerConfig` contract |

## Building

    make build

## Testing

    make test

## Docker

    make docker
