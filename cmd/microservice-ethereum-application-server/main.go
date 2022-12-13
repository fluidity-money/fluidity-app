// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"

	"github.com/ethereum/go-ethereum/ethclient"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

const (
	// EnvContractAddress is the Fluid token contract
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvUnderlyingTokenDecimals supported by the contract
	EnvUnderlyingTokenDecimals = `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`

	// EnvApplicationContracts to list the application contracts to monitor
	EnvApplicationContracts = `FLU_ETHEREUM_APPLICATION_CONTRACTS`

	// EnvServerWorkQueue to send serverwork down
	EnvServerWorkQueue = `FLU_ETHEREUM_WORK_QUEUE`
)

func main() {
	var (
		publishAmqpTopic         = util.GetEnvOrFatal(EnvServerWorkQueue)
		contractAddrString       = util.GetEnvOrFatal(EnvContractAddress)
		gethHttpUrl              = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
		applicationContracts_    = util.GetEnvOrFatal(EnvApplicationContracts)
	)

	contractAddress := ethCommon.HexToAddress(contractAddrString)

	tokenDecimals, err := strconv.Atoi(underlyingTokenDecimals_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Underlying token decimals %#v is a malformed int!",
				underlyingTokenDecimals_,
			)

			k.Payload = err
		})
	}

	var applicationContracts []ethereum.Address

	for _, address := range strings.Split(applicationContracts_, ",") {
		address := ethereum.AddressFromString(address)

		applicationContracts = append(applicationContracts, address)
	}

	gethClient, err := ethclient.Dial(gethHttpUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	defer gethClient.Close()

	worker.GetEthereumBlockLogs(process(
		publishAmqpTopic,
		contractAddress,
		gethClient,
		tokenDecimals,
		applicationContracts,
		nil,
	))
}
