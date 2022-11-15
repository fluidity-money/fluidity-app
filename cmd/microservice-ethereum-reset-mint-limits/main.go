// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	_ "embed"
	"math/big"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/common/ethereum"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	// EnvEthereumHttpUrl to use to connect to Geth to send amounts
	EnvEthereumHttpUrl = "FLU_ETHEREUM_HTTP_URL"

	// EnvPrivateKey to use when signing requests to update the mint limits
	EnvPrivateKey = `FLU_ETHEREUM_WORKER_PRIVATE_KEY`
)

var (
	//go:embed global-limit-schedule.json
	ScheduleGlobalMintLimitString string

	//go:embed user-mint-limit-schedule.json
	ScheduleUserMintLimitString string
)

var (
	// ScheduleGlobalMintLimit to use for relaxing the global mint limit based
	// on the day (UTC)
	ScheduleGlobalMintLimit map[string]map[string]string

	// ScheduleUserMintLimit to use for relaxing the user mint limit
	ScheduleUserMintLimit map[string]map[string]string
)

func main() {
	var (
		privateKey_     = util.GetEnvOrFatal(EnvPrivateKey)
		ethereumHttpUrl = util.GetEnvOrFatal(EnvEthereumHttpUrl)
	)

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

	defer ethClient.Close()

	now := time.Now().UTC()

	key := now.Format("06-01-2")

	globalMintLimits, ok := ScheduleGlobalMintLimit[key]

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Unable to find global mint limit!"
			k.Payload = key
		})
	}

	userMintLimits, ok := ScheduleUserMintLimit[key]

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Unable to find user mint limit!"
			k.Payload = key
		})
	}

	for contractAddress_, _ := range globalMintLimits {
		var (
			globalMintLimit_ = globalMintLimits[contractAddress_]
			userMintLimit_   = userMintLimits[contractAddress_]
		)

		contractAddress := ethCommon.HexToAddress(contractAddress_)

		transactOpts, err := ethereum.NewTransactionOptions(ethClient, privateKey)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to create the transaction options!"
				k.Payload = err
			})
		}

		globalMintLimit, ok := new(big.Int).SetString(globalMintLimit_, 10)

		if !ok {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to convert the global mint limit string to a bigint!"
				k.Payload = contractAddress
			})
		}

		userMintLimit, ok := new(big.Int).SetString(userMintLimit_, 10)

		if !ok {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to convert the user mint limit string to a bigint!"
				k.Payload = contractAddress
			})
		}

		updateMintLimits(
			ethClient,
			transactOpts,
			contractAddress,
			globalMintLimit,
			userMintLimit,
		)
	}
}
