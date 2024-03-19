// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	appTypes "github.com/fluidity-money/fluidity-app/lib/types/applications"
	typesEth "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvExecutorAddress is the contract where the fluidity executor is located
	EnvExecutorAddress = `FLU_ETHEREUM_EXECUTOR_CONTRACT_ADDR`

	// EnvContractAddress is the contract to call when a winner's been found
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvEthereumHttpUrl is the url to use to connect to the HTTP Geth endpoint
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvPrivateKey is the hex-encoded private key used to sign calls to the reward function
	EnvPrivateKey = `FLU_ETHEREUM_WORKER_PRIVATE_KEY`

	// EnvGasLimit to use to manually set the gas limit on chains with bad
	// behaviour. Should be set to 8 million for Ropsten.
	EnvGasLimit = `FLU_ETHEREUM_GAS_LIMIT`

	// EnvUseHardhatFix instead of trying to guess the gas or set it manually
	EnvUseHardhatFix = `FLU_ETHEREUM_HARDHAT_FIX`

	// EnvUseLegacyContract to use the old single reward call instead of the
	// new batchReward call
	EnvUseLegacyContract = `FLU_ETHEREUM_LEGACY_CONTRACT`

	// EnvPublishAmqpQueueName to use to receive RLP-encoded blobs down
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_AMQP_QUEUE_NAME`

	// EnvLpRewardQueueName to receive spooled rewards going to liquidity providers on the AMM
	EnvLpRewardQueueName = `FLU_ETHEREUM_LP_REWARD_AMQP_QUEUE_NAME`

	// EnvUtilityTokensMap to map utility clients to the tokens they transfer, for AMM rewards
	EnvUtilityTokensMap = `FLU_ETHEREUM_UTILITY_TOKENS_LOOKUP`
)

// wait at most 5 minutes for our transactions to be mined
const MiningTimeout = time.Minute * 5

// details needed to update the reward type database
type win = struct {
	rewardTransactionHash typesEth.Hash
	sendTransactionHash   typesEth.Hash
	winnerAddress         typesEth.Address
}

func utilityTokensListFromEnvOrFatal(env string) map[appTypes.UtilityName]ethCommon.Address {
	var (
		utilityTokens_       = util.GetEnvOrFatal(EnvUtilityTokensMap)
		utilityToTokenLookup = make(map[appTypes.UtilityName]ethCommon.Address)
	)

	for _, entry := range strings.Split(utilityTokens_, ",") {
		split := strings.Split(entry, ":")

		if len(split) != 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Unexpected utility tokens map entry '%s'",
					split,
				)
			})
		}

		var (
			utility = split[0]
			token_  = split[1]
			token   = ethCommon.HexToAddress(token_)
		)

		utilityToTokenLookup[appTypes.UtilityName(utility)] = token
	}

	return utilityToTokenLookup
}

func main() {
	var (
		contractAddrString        = util.GetEnvOrFatal(EnvContractAddress)
		executorAddrString        = util.GetEnvOrFatal(EnvExecutorAddress)
		gethHttpUrl               = util.PickEnvOrFatal(EnvEthereumHttpUrl)
		privateKey_               = util.GetEnvOrFatal(EnvPrivateKey)
		publishAmqpQueueName      = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		publishLpRewardsQueueName = util.GetEnvOrFatal(EnvLpRewardQueueName)
		utilityTokensMap          = utilityTokensListFromEnvOrFatal(EnvUtilityTokensMap)

		useHardhatFix     bool
		useLegacyContract        = os.Getenv(EnvUseLegacyContract) == "true"
		gasLimit          uint64 = 0
	)

	var err error

	if os.Getenv(EnvUseHardhatFix) == "true" {
		useHardhatFix = true

		log.Debug(func(k *log.Log) {
			k.Message = "Using the hardhat gas fix!"
		})
	}

	if gasLimit_ := os.Getenv(EnvGasLimit); gasLimit_ != "" {
		gasLimit, err = strconv.ParseUint(gasLimit_, 10, 64)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to parse hardcoded gas limit!"
				k.Payload = err
			})
		}
	}

	log.Debug(func(k *log.Log) {
		k.Format("Using the legacy contract ABI: %t!", useLegacyContract)
	})

	privateKey, err := ethCrypto.HexToECDSA(privateKey_)

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

	var (
		contractAddress_ = ethCommon.HexToAddress(contractAddrString)
		executorAddress_ = ethCommon.HexToAddress(executorAddrString)
	)

	transactionOptions, err := ethereum.NewTransactionOptions(ethClient, privateKey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the transaction options!"
			k.Payload = err
		})
	}

	rewardsQueue := make(chan worker.EthereumSpooledRewards)
	lpRewardsQueue := make(chan worker.EthereumSpooledLpRewards)

	go queue.GetMessages(publishAmqpQueueName, func(message queue.Message) {
		var announcement worker.EthereumSpooledRewards

		message.Decode(&announcement)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to decode an announcement!"
				k.Payload = err
			})
		}

		rewardsQueue <- announcement
	})

	go queue.GetMessages(publishLpRewardsQueueName, func(message queue.Message) {
		var announcement worker.EthereumSpooledLpRewards

		message.Decode(&announcement)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to decode an announcement!"
				k.Payload = err
			})
		}

		lpRewardsQueue <- announcement
	})

	for {
		var transaction *types.Transaction

		// we need this to process single threadedly to stop nonce desyncs
		select {
		case announcement := <-rewardsQueue:
			rewardTransactionArguments := callRewardArguments{
				transactionOptions:    transactionOptions,
				containerAnnouncement: announcement,
				executorAddress:       executorAddress_,
				contractAddress:       contractAddress_,
				client:                ethClient,
				useHardhatFix:         useHardhatFix,
				hardcodedGasLimit:     gasLimit,
			}

			transaction, err = callRewardFunction(rewardTransactionArguments)

		case announcement := <-lpRewardsQueue:
			lpRewardTransactionArguments := callLpRewardArguments{
				tokens:                utilityTokensMap,
				transactionOptions:    transactionOptions,
				containerAnnouncement: announcement,
				executorAddress:       executorAddress_,
				contractAddress:       contractAddress_,
				client:                ethClient,
			}

			transaction, err = callLpRewardFunction(lpRewardTransactionArguments)
		}

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to call a reward transaction with transaction hash %#v!",
					transaction,
				)

				k.Payload = err
			})
		}

		log.App(func(k *log.Log) {
			k.Message = "Successfully called a contract function with hash"
			k.Payload = transaction.Hash().Hex()
		})

		log.Debugf("Waiting for reward transaction to be mined...")

		ctx, cancel := context.WithTimeout(context.Background(), MiningTimeout)

		receipt, err := bind.WaitMined(ctx, ethClient, transaction)

		// done with the context now
		cancel()

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Error waiting for reward transaction to be mined!"
				k.Payload = err
			})
		}

		log.Debugf(
			"Reward transaction mined in block %s!",
			receipt.BlockNumber.String(),
		)
	}
}
