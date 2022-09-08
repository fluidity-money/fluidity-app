// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"bytes"
	"fmt"
	"io"
	"time"

	"github.com/fluidity-money/fluidity-app/common/aws"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/log/discord"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/aws/aws-lambda-go/lambda"
	awsCommon "github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	// EnvAwsRegion is the AWS region to use (probably ap-southeast-2)
	EnvAwsRegion = `FLU_AWS_REGION`

	// EnvOracleBucketName is the S3 bucket to place the signed transaction
	EnvOracleBucketName = `FLU_ORACLE_BUCKET_NAME`

	// EnvOracleParametersList is the comma-separated list of AWS parameters
	// containing oracles that need to be updated, and their respective
	// contract addresses of the form contract1:param1,contract2:param2,...
	EnvOracleParametersList = `FLU_ORACLE_UPDATE_LIST`

	// EnvGethHttpUrl to use when performing RPC requests
	EnvGethHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvAwsClusterName to determine which cluster to restart the services in
	EnvAwsClusterName = `FLU_AWS_CLUSTER`

	// EnvAwsServiceName to match services that include it in their names
	EnvAwsServiceName = `FLU_AWS_SERVICE`
)

func main() {
	lambda.Start(rotateOracleKeys)
}

func rotateOracleKeys() {
	var (
		awsRegion   = util.GetEnvOrFatal(EnvAwsRegion)
		bucketName  = util.GetEnvOrFatal(EnvOracleBucketName)
		gethHttpUrl = util.GetEnvOrFatal(EnvGethHttpUrl)
		clusterName = util.GetEnvOrFatal(EnvAwsClusterName)
		serviceName = util.GetEnvOrFatal(EnvAwsServiceName)

		oracleParametersList = oracleParametersListFromEnv(EnvOracleParametersList)
	)

	// create AWS session
	session, err := session.NewSession(&awsCommon.Config{
		Region: &awsRegion,
	})

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create an AWS session!"
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

	// ensure output bucket exists
	err = aws.WaitUntilBucketExists(session, bucketName)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to wait for bucket %v: %v",
				bucketName,
				err,
			)
		})
	}

	var (
		fileContent string

		signedTxnAttachments = make(map[string]io.Reader)
		timestamp            = time.Now().UTC().String()
		fileName             = "Oracle Update " + timestamp
	)

	// update each oracle in sequence
	for _, oracle := range oracleParametersList {

		var (
			parameter             = oracle.Parameter
			contractAddressString = oracle.ContractAddress
		)

		contractAddress := ethCommon.HexToAddress(contractAddressString)

		// get the old key
		oldOraclePrivateKey, err := aws.GetPrivateKeyFromParameter(session, parameter)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to look up the old private key in AWS!"
				k.Payload = err
			})
		}

		previousOracleAddress := ethCrypto.PubkeyToAddress(oldOraclePrivateKey.PublicKey)

		// create the new key
		newOraclePrivateKey, err := ethCrypto.GenerateKey()

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to generate a new private key!"
				k.Payload = err
			})
		}

		// get the new address
		newOraclePublicKey := ethCrypto.PubkeyToAddress(newOraclePrivateKey.PublicKey)

		// left pad with zeros to 32 bytes
		digest := newOraclePublicKey.Hash().Bytes()

		// sign the new address using the old private key
		signature, err := ethCrypto.Sign(digest, oldOraclePrivateKey)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to sign the new address wih the old private key!"
				k.Payload = err
			})
		}

		err = createAndSignSendTransaction(ethClient, previousOracleAddress, newOraclePublicKey, contractAddress, oldOraclePrivateKey, signedTxnAttachments)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to create and sign the send transaction!"
				k.Payload = err
			})
		}

		// convert the new key to hex to update the parameter
		keyBytes := ethCrypto.FromECDSA(newOraclePrivateKey)
		newOraclePrivateKeyHex := hexutil.Encode(keyBytes)[2:]

		// append to the log
		addressChangeLog := fmt.Sprintf(
			"[%v] Changing oracle address on contract %v from %v to %v!\n-----Begin Digest-----\n%v\n-----End Digest-----\n",
			timestamp,
			contractAddress,
			previousOracleAddress,
			newOraclePublicKey,
			signature,
		)

		fileContent += addressChangeLog

		// update parameter store for this contract
		ssmClient := ssm.New(session)

		input := &ssm.PutParameterInput{
			Name:      &parameter,
			Value:     &newOraclePrivateKeyHex,
			Overwrite: awsCommon.Bool(true),
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

	// create a reader with the file content
	fileContentReader := bytes.NewReader([]byte(fileContent))

	// upload the file containing a list of all oracle updates and their signed digests
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

	// send a discord message containing the public URL, with Eth transfer
	// transactions as attachments
	bucketUrl := uploadLogsOutput.Location

	discordMessage := fmt.Sprintf("Uploaded log to S3 bucket at URL: %v", bucketUrl)

	discord.NotifyWithAttachment(
		discord.SeverityNotice,
		discordMessage,
		signedTxnAttachments,
	)

	err = aws.RestartTasksMatchingServiceName(session, clusterName, serviceName)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to restart worker tasks!"
			k.Payload = err
		})
	}
}
