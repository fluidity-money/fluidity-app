// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/log/discord"
	"github.com/fluidity-money/fluidity-app/lib/util"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	// EnvContractAddress is the contract to call to update the mint limits on
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvEthereumHttpUrl to use to connect to Geth to send amounts
	EnvEthereumHttpUrl = "FLU_ETHEREUM_HTTP_URL"

	// EnvPrivateKey to use when signing requests to send amount from the faucet
	EnvPrivateKey = `FLU_ETHEREUM_FAUCET_PRIVATE_KEY`

	// EnvGlobalMintLimits to update the restriction set to
	EnvGlobalMintLimit = `FLU_ETHEREUM_GLOBAL_MINT_LIMIT`

	// EnvUserMintLimits to update the global user limit
	EnvUserMintLimit = `FLU_ETHEREUM_USER_USER_LIMIT`
)

func main() {
	var (
		contractAddress_  = util.GetEnvOrFatal(EnvContractAddress)
		privateKey_       = util.GetEnvOrFatal(EnvPrivateKey)
		ethereumHttpUrl   = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		globalMintLimit_ = util.GetEnvOrFatal(EnvGlobalMintLimit)
		userMintLimit_    = util.GetEnvOrFatal(EnvUserMintLimit)
	)

	userMintLimit, success := new(big.Int).SetString(userMintLimit_, 10)

	if !success {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert the user mint limit string to a bigint!"
		})
	}

	globalMintLimit, success := new(big.Int).SetString(globalMintLimit_, 10)

	if !success {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert the global mint limit string to a bigint!"
		})
	}

	contractAddress := ethCommon.HexToAddress(contractAddress_)

	privateKey, err := ethCrypto.HexToECDSA(privateKey_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert the private key passed to a private key!"
			k.Payload = err
		})
	}

	ethClient, err := ethclient.Dial(ethereumHttpUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to dial into Geth!"
			k.Payload = err
		})
	}

	transactionOptions, err := ethereum.NewTransactionOptions(ethClient, privateKey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the transaction options!"
			k.Payload = err
		})
	}

	transaction, err := fluidity.TransactUpdateMintLimits(
		ethClient,
		contractAddress,
		globalMintLimit,
		userMintLimit,
		transactionOptions,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to update the mint limits!"
			k.Payload = err
		})
	}

	transactionHash := transaction.Hash().Hex()

	discord.Notify(
		discord.SeverityAlarm,
		"Updated mint limits, transaction %v",
		transactionHash,
	)

	log.App(func(k *log.Log) {
		k.Format(
			"Updated mint limits, transaction %v",
			transactionHash,
		)
	})
}
