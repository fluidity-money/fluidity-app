// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

// this is a template for a microservice for filtering transfer events
// without using abigen/etc

import (
	"errors"
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	logging "github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// FilterEventSignature to use to filter for event signatures
	FilterEventSignature = `Reward(address,uint256,uint256,uint256)`

	FilterUnblockedEventSignature = `UnblockedReward(address,address,uint256,uint256,uint256)`

	// FilterBlockedEventSignature to use to filter for blocked reward events
	FilterBlockedEventSignature = `BlockedReward(address,uint256,uint256,uint256)`

	// expectedRewardTopics to ensure logs received have the expected number of topics
	// (sig, winner address)
	expectedRewardTopics = 2

	// EnvContractAddress to watch where the reward function was called
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvUnderlyingTokenName of the token wrapped by the Fluid Asset
	EnvUnderlyingTokenName = `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`

	// EnvUnderlyingTokenDecimals supported by the contract
	EnvUnderlyingTokenDecimals = `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`

	// EnvNetwork to differentiate between eth, arb, etc
	EnvNetwork = `FLU_ETHEREUM_NETWORK`

	winnersPublishTopic = winners.TopicWinnersEthereum

	blockedWinnersPublishTopic = winners.TopicBlockedWinnersEthereum
)

func main() {
	var (
		filterAddress            = util.GetEnvOrFatal(EnvContractAddress)
		underlyingTokenName      = util.GetEnvOrFatal(EnvUnderlyingTokenName)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
		net_                     = util.GetEnvOrFatal(EnvNetwork)
	)

	network_, err := network.ParseEthereumNetwork(net_)

	if err != nil {
		logging.Fatal(func (k *logging.Log) {
			k.Message = "Failed to read an ethereum network from env!"
			k.Payload = err
		})
	}

	underlyingTokenDecimals, err := strconv.Atoi(underlyingTokenDecimals_)

	if err != nil {
		logging.Fatal(func(k *logging.Log) {
			k.Format(
				"Underlying token decimals %#v is a malformed int!",
				underlyingTokenDecimals_,
			)

			k.Payload = err
		})
	}

	ethereum.Logs(func(log ethereum.Log) {

		var (
			logTopics        = log.Topics
			transactionHash  = log.TxHash
			logAddress       = log.Address
			logAddressString = logAddress.String()
		)

		// first, we're going to make the string lowercase

		logAddressString = strings.ToLower(logAddressString)
		filterAddress = strings.ToLower(filterAddress)

		logging.Debug(func(k *logging.Log) {
			k.Format(
				"Found a log, address was %v, matching %v",
				logAddress,
				filterAddress,
			)
		})

		// address doesn't match our target contract!

		if filterAddress != logAddressString {
			return
		}

		if len(logTopics) == 0 {
			logging.Debug(func(k *logging.Log) {
				k.Format(
					"Log has no topics! Skipping...",
				)
			})

			return
		}

		tokenDetails := token_details.New(
			underlyingTokenName,
			underlyingTokenDecimals,
		)

		rewardData, err := fluidity.TryDecodeRewardData(log, tokenDetails)

		// if we matched a reward event, process it and return
		// otherwise continue on to try the unblockreward event,
		// or die if there was an error

		switch err {
		case nil:
			processReward(
				logAddress,
				transactionHash,
				rewardData,
				tokenDetails,
				network_,
			)

			return

		case fluidity.ErrWrongEvent:
			logging.Debug(func(k *logging.Log) {
				k.Format(
					"Log signature %s didn't decode as a reward or blockedReward!",
					logTopics[0],
				)
			})

		default:
			logging.Fatal(func(k *logging.Log) {
				k.Message = "Error decoding a reward or blockedReward!"
				k.Payload = err
			})
		}

		unblockedRewardData, err := fluidity.TryDecodeUnblockedRewardData(
			log,
			tokenDetails,
		)

		switch err {
		case nil:
			processUnblockedReward(
				transactionHash,
				unblockedRewardData,
				tokenDetails,
				network_,
			)

		case fluidity.ErrWrongEvent:
			logging.Debug(func(k *logging.Log) {
				k.Format(
					"Log signature %s didn't decode as an unblockedReward!",
					logTopics[0],
				)
			})

		default:
			logging.Fatal(func(k *logging.Log) {
				k.Message = "Error decoding a reward or blockedReward!"
				k.Payload = err
			})
		}
	})
}
