package main

import (
	"bytes"
	"fmt"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
	awsCommon "github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/ssm"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/cmd/microservice-key-rotation/lib/aws"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvEthereumHttpUrl is the url to use to connect to the HTTP Geth endpoint
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvAwsRegion is the AWS region to use (probably ap-southeast-2)
	EnvAwsRegion = `FLU_AWS_REGION`

	// EnvOracleBucketName is the S3 bucket to place the signed transaction
	EnvOracleBucketName = `FLU_ORACLE_BUCKET_NAME`

	// EnvOracleParameterName is the comma-separated list of AWS parameters
	// containing oracles that need be updated, and their respective
	// contract addresses of the form param1:contract1,param2:contract2,...
	EnvOracleParametersList = `FLU_ORACLE_UPDATE_LIST`

	// EnvWorkerConfigPrivateKey is the key that signs the transaction to
	// batch update the oracles
	EnvWorkerConfigPrivateKey = `FLU_WORKER_CONFIG_PRIVATE_KEY`
)

const bucketAcl = s3.BucketCannedACLPrivate

func main() {
	lambda.Start(rotateOracleKeys)
}

func rotateOracleKeys() {
	var (
		gethHttpUrl             = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		awsRegion               = util.GetEnvOrFatal(EnvAwsRegion)
		bucketName              = util.GetEnvOrFatal(EnvOracleBucketName)
		workerConfigPrivateKey_ = util.GetEnvOrFatal(EnvWorkerConfigPrivateKey)

		oracleParametersList = oracleParametersListFromEnv(EnvOracleParametersList)
	)

	workerConfigPrivateKey, err := ethCrypto.HexToECDSA(workerConfigPrivateKey_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert the hex string private key to a private key!"
			k.Payload = err
		})
	}

	ethClient, err := ethclient.Dial(gethHttpUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	defer ethClient.Close()

	session, err := session.NewSession(&awsCommon.Config{
		Region: &awsRegion,
	})

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create an AWS session!"
			k.Payload = err
		})
	}

	outputTxnBucket, err := aws.CreateBucketIfNotExists(session, bucketName, bucketAcl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create an AWS bucket"
			k.Payload = err
		})
	}

	if outputTxnBucket != nil {
		log.App(func(k *log.Log) {
			k.Message = "Created the AWS bucket!"
			k.Payload = outputTxnBucket
		})
	}

	var (
		timestamp = time.Now().UTC().String()
		fileName  = "Oracle Update " + timestamp

		fileContent   string
		newOracleList []ethCommon.Address
	)

	// update each oracle in sequence
	for _, oracle := range oracleParametersList {

		var (
			parameter             = oracle.Parameter
			contractAddressString = oracle.ContractAddress
		)

		fileName += " " + parameter

		contractAddress := ethCommon.HexToAddress(contractAddressString)

		// get the old key
		privateKey := aws.LookupCurrentOraclePrivateKeyUsingParameterStore()
		previousOracleAddress := ethCrypto.PubkeyToAddress(privateKey.PublicKey)

		// create the new key
		key, err := ethCrypto.GenerateKey()

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to generate a new private key!"
				k.Payload = err
			})
		}

		// store the new oracle address
		newOracle := ethCrypto.PubkeyToAddress(key.PublicKey)
		newOracleList = append(newOracleList, newOracle)

		// obtain the new key as hex to update the parameter
		keyBytes := ethCrypto.FromECDSA(key)
		newOraclePrivateKeyHex := hexutil.Encode(keyBytes)[2:]

		// append to the log
		addressChangeLog := fmt.Sprintf(
			"[%v] Changing oracle address on contract %v from %v to %v!\n",
			timestamp,
			contractAddress,
			previousOracleAddress,
			newOracle,
		)

		fileContent += addressChangeLog

		// update parameter store for this contract
		ssmClient := ssm.New(session)

		input := &ssm.PutParameterInput{
			Name:  &parameter,
			Value: &newOraclePrivateKeyHex,
		}

		putOutput, err := ssmClient.PutParameter(input)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to PUT the new oracle private key!"
				k.Payload = err
			})
		}

		log.App(func(k *log.Log) {
			k.Message = "PUT the new oracle private key secret successfully!"
			k.Payload = putOutput
		})
	}

	transactionOpts, err := ethereum.NewTransactionOptions(ethClient, workerConfigPrivateKey)

	workerConfigPublicKey := workerConfigPrivateKey.PublicKey
	workerConfigContractAddress := ethCrypto.PubkeyToAddress(workerConfigPublicKey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the transaction options!"
			k.Payload = err
		})
	}

	// TODO have this but it returns a signed txn rather than calling the contract
	transaction, err := fluidity.UpdateOracle(
		ethClient,
		workerConfigContractAddress,
		transactionOpts,
		newOracleList,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create and sign the oracle update transaction!"
			k.Payload = err
		})
	}

	txnBinary, err := transaction.MarshalBinary()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to marshal the transaction into binary!"
			k.Payload = err
		})
	}

	signedTxnString := fmt.Sprintf(
		"Signed transaction dump:\n---\n%v\n---\n",
		txnBinary,
	)

	fileContent += signedTxnString

	// create a reader with the file content
	fileContentReader := bytes.NewReader([]byte(fileContent))

	// upload the file containing a list of all oracle updates, and the signed transaction
	uploadLogsOutput, err := aws.UploadToBucket(session, fileContentReader, fileName, bucketName)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to upload logs to the bucket!"
			k.Payload = err
		})
	}

	log.App(func(k *log.Log) {
		k.Message = "Uploaded oracle transaction to bucket successfully!"
		k.Payload = uploadLogsOutput
	})
}
