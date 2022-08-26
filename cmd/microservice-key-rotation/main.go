package main

import (
	"bytes"
	"crypto/ecdsa"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/aws/aws-sdk-go/service/ssm"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
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
	var (
		gethHttpUrl             = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		awsRegion               = util.GetEnvOrFatal(EnvAwsRegion)
		bucketName              = util.GetEnvOrFatal(EnvOracleBucketName)
		oracleParametersList_   = util.GetEnvOrFatal(EnvOracleParametersList)
		workerConfigPrivateKey_ = util.GetEnvOrFatal(EnvWorkerConfigPrivateKey)
    )


	o := strings.Split(oracleParametersList_, ",")	
	numberOfTokens := len(o)

	type S struct {
		ContractAddress string 
		// the AWS parameter key containing this oracle private key
		Parameter string	
	}

	oracleParametersList := make([]S, numberOfTokens)
	for i, v := range o {
		s := strings.Split(v, ":")
		if len(s) != 2 {
			panic("wrong len")
		}
		oracleParametersList[i] = S{s[0], s[1]}
	}

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

	session, err := session.NewSession(&aws.Config{
		Region: &awsRegion,
	})

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to create an AWS session!"
            k.Payload = err
        })
    }

	outputTxnBucket, err := createBucketIfNotExists(session, bucketName, bucketAcl)

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

	timestamp := time.Now().UTC().String()
	fileName := "Oracle Update " + timestamp
	var fileContent string
	var newOracleList []ethCommon.Address

	// update each oracle in sequence
	for _, v := range oracleParametersList {
		fileName += " " + v.Parameter

		contractAddress := ethCommon.HexToAddress(v.ContractAddress)
		
		// get the old key
		privateKey := lookupCurrentOraclePrivateKeyUsingParameterStore()
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
		s := fmt.Sprintf(
			"[%v] Changing oracle address on contract %v from %v to %v!\n",
			timestamp,
			contractAddress,
			previousOracleAddress,
			newOracle,
		)

		fileContent += s

		// update parameter store for this contract
		ssmClient := ssm.New(session)
		input := &ssm.PutParameterInput{
			Name: aws.String(v.Parameter),
			Value: aws.String(newOraclePrivateKeyHex),
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

	s := fmt.Sprintf(
		"Signed transaction dump:\n---\n%v\n---\n",
		txnBinary,
	)

	fileContent += s

	// create a reader with the file content
	reader := bytes.NewReader([]byte(fileContent))

	// upload the file containing a list of all oracle updates, and the signed transaction
	uploadLogsOutput, err := uploadToBucket(session, reader, fileName, bucketName)

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

// uploadToBucket to put a file in a bucket
func uploadToBucket(session *session.Session, fileContent io.ReadSeeker, fileName, bucketName string) (*s3manager.UploadOutput, error) {
	uploader := s3manager.NewUploader(session)

	output, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: &bucketName,
		Key: &fileName,
		Body: fileContent,
		ACL: aws.String(s3.BucketCannedACLAuthenticatedRead),
	})

	if err != nil {
		return nil, fmt.Errorf(
			"Unable to upload %v to %v, %v", 
			fileName,
			bucketName, 
			err,
		)
	}

	fmt.Printf("Successfully uploaded %v to %v\n", fileName, bucketName)

	return output, nil 
}

// createBucket to create a new bucket
func createBucket(session *session.Session, bucketName, acl string) (*s3.CreateBucketOutput, error) {

	fmt.Printf("creating bucket %v with acl %v\n",bucketName,acl)

	svc := s3.New(session)
	// Create the S3 Bucket
	output, err := svc.CreateBucket(&s3.CreateBucketInput{
        Bucket: &bucketName,
		ACL: &acl,
    })

    if err != nil {
        return nil, fmt.Errorf(
			"Unable to create bucket with name %v, %v",
			bucketName, 
			err,
		)
    }

    // Wait until bucket is created before finishing
    fmt.Printf("Waiting for bucket %v to be created...\n", bucketName)

    err = svc.WaitUntilBucketExists(&s3.HeadBucketInput{
        Bucket: &bucketName,
    })

    if err != nil {
        return nil, fmt.Errorf(
			"Error occurred while waiting for bucket %v to be created: %v",
			bucketName,
			err,
		)
    }

	return output, nil
}

// createBucketIfNotExists to either create a bucket, or return nil, nil if the bucket already exists
func createBucketIfNotExists(session *session.Session, bucketName, acl string) (*s3.CreateBucketOutput, error) {
	output, err := createBucket(session, bucketName, acl)
	
    if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case s3.ErrCodeBucketAlreadyExists:
				fallthrough
			case s3.ErrCodeBucketAlreadyOwnedByYou:
				log.App(func(k *log.Log) {
					k.Format(
						"Bucket %v already exists - using it!",
						bucketName,
					)
				})
			default:
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to create a bucket!"
					k.Payload = aerr.Error()
				})
			}

		} else {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to create a bucket!"
				k.Payload = err
			})
		}
	}

	return output, nil
}

func lookupCurrentOraclePrivateKeyUsingParameterStore() *ecdsa.PrivateKey {
	panic("why would you name it like that")
}
