// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

// this is a template for a microservice for filtering transfer events
// without using abigen/etc

import (
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	logging "github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-track-winners/lib"
)

const (
	// FilterEventSignature to use to filter for event signatures
	FilterEventSignature = `Reward(address,uint256,uint256,uint256)`

	// FilterBlockedEventSignature to use to filter for blocked reward events
	FilterBlockedEventSignature = `BlockedReward(address,uint256,uint256,uint256)`

	// expectedTopicsLen to ensure logs received have the expected number of topics
	// (sig, winner address)
	expectedTopicsLen = 2

	// FilterLegacyEventSignature to use to filter for event signatures
	// on the legacy contract
	FilterLegacyEventSignature = `Reward(address,uint256)`

	// legacyExpectedTopicsLen to ensure legacy logs received have the expected
	// number of topics (sig, winner, amount)
	legacyExpectedTopicsLen = 3

	// EnvContractAddress to watch where the reward function was called
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvUnderlyingTokenName of the token wrapped by the Fluid Asset
	EnvUnderlyingTokenName = `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`

	// EnvUnderlyingTokenDecimals supported by the contract
	EnvUnderlyingTokenDecimals = `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`

	// EnvUseLegacyContract to use the old event signature
	// for legacy deployments
	EnvUseLegacyContract = `FLU_ETHEREUM_LEGACY_CONTRACT`

	winnersPublishTopic = winners.TopicWinnersEthereum

	blockedWinnersPublishTopic = winners.TopicBlockedWinnersEthereum
)

func main() {
	var (
		filterAddress            = util.GetEnvOrFatal(EnvContractAddress)
		underlyingTokenName      = util.GetEnvOrFatal(EnvUnderlyingTokenName)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)

		useLegacyContract = os.Getenv(EnvUseLegacyContract) == "true"

		eventSig string
		expectedTopics int
	)

	if !useLegacyContract {
		eventSig = FilterEventSignature
		expectedTopics = expectedTopicsLen
	} else {
		eventSig = FilterLegacyEventSignature
		expectedTopics = legacyExpectedTopicsLen
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

	eventSignature := microservice_ethereum_track_winners.HashEventSignature(
		eventSig,
	)

	blockedEventSignature := microservice_ethereum_track_winners.HashEventSignature(
		FilterBlockedEventSignature,
	)

	logging.Debug(func(k *logging.Log) {
		k.Format(
			"Filtering for event signatures %s and %s",
			eventSignature,
			blockedEventSignature,
		)
	})

	ethereum.Logs(func(log ethereum.Log) {

		var (
			logTopics       = log.Topics
			transactionHash = string(log.TxHash)
			logAddress      = string(log.Address)
		)

		// first, we're going to make the string lowercase

		logAddress = strings.ToLower(logAddress)
		filterAddress = strings.ToLower(filterAddress)

		logging.Debug(func(k *logging.Log) {
			k.Format(
				"Found a log, address was %v, matching %v",
				logAddress,
				filterAddress,
			)
		})

		// address doesn't match our target contract!

		if filterAddress != logAddress {
			return
		}

		messageReceivedTime := time.Now()

		if lenLogTopics := len(logTopics); lenLogTopics != expectedTopics {
			logging.Debug(func(k *logging.Log) {
				k.Format(
					"The number of topics for log transaction %v was expected to be %v, is %v! %v",
					transactionHash,
					expectedTopics,
					lenLogTopics,
					logTopics,
				)
			})

			return
		}

		logging.Debug(func(k *logging.Log) {
			k.Format(
				"The log transaction %v for topic 0 is %v, am expecting %v or %v!",
				transactionHash,
				logTopics[0],
				eventSignature,
				blockedEventSignature,
			)
		})

		var blockedReward bool

		switch string(logTopics[0]) {
		case eventSignature:
			blockedReward = false

		case blockedEventSignature:
			blockedReward = true

		default:
			logging.Debug(func(k *logging.Log) {
				k.Format(
					"The log transaction %v for topic 0 is %v, was expecting %v!",
					transactionHash,
					logTopics[0],
					eventSig,
				)
			})

			return
		}

		tokenDetails := token_details.New(
			underlyingTokenName,
			underlyingTokenDecimals,
		)

		var (
			rewardData fluidity.RewardData
			err  error
		)

		if !useLegacyContract {
			rewardData, err = fluidity.DecodeRewardData(log, tokenDetails)
		} else {
			rewardData, err = fluidity.DecodeLegacyRewardData(log, tokenDetails)
		}

		if err != nil {
			logging.Fatal(func(k *logging.Log) {
				k.Message = "Failed to decode reward data from events!"
				k.Payload = err
			})
		}

		convertedWinner := microservice_ethereum_track_winners.ConvertWinner(transactionHash, rewardData, tokenDetails, messageReceivedTime)

		var publishTopic string

		if blockedReward {
			publishTopic = blockedWinnersPublishTopic
		} else {
			publishTopic = winnersPublishTopic
		}

		microservice_ethereum_track_winners.SendWinner(
			useLegacyContract,
			publishTopic,
			convertedWinner,
		)
	})
}
