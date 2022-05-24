package main

// this is a template for a microservice for filtering transfer events
// without using abigen/etc

import (
	"strconv"
	"strings"
	"time"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	logging "github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-track-winners/lib"
)

const (
	// FilterEventSignature to use to filter for event signatures
	FilterEventSignature = `Reward(bytes32,address,uint256,address,uint256)`

	// EnvContractAddress to watch where the reward function was called
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvUnderlyingTokenName of the token wrapped by the Fluid Asset
	EnvUnderlyingTokenName = `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`

	// EnvUnderlyingTokenDecimals supported by the contract
	EnvUnderlyingTokenDecimals = `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`

	winnersPublishTopic = winners.TopicWinnersEthereum

	rewardPublishTopic = winners.TopicRewardsEthereum
)

func main() {
	var (
		filterAddress            = util.GetEnvOrFatal(EnvContractAddress)
		underlyingTokenName      = util.GetEnvOrFatal(EnvUnderlyingTokenName)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
	)

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

	eventSignature := microservice_common_track_winners.HashEventSignature(
		FilterEventSignature,
	)

	logging.Debug(func(k *logging.Log) {
		k.Message = "Filtering for event signature"
		k.Payload = eventSignature
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

		if lenLogTopics := len(logTopics); lenLogTopics != 3 {
			logging.Debug(func(k *logging.Log) {
				k.Format(
					"The number of topics for log transaction %v was expected to be %v, is %v! %v",
					transactionHash,
					3,
					lenLogTopics,
					logTopics,
				)
			})

			return
		}

		logging.Debug(func(k *logging.Log) {
			k.Format(
				"The log transaction %v for topic 0 is %v, am expecting %v!",
				transactionHash,
				logTopics[0],
				eventSignature,
			)
		})

		if string(logTopics[0]) != eventSignature {
			logging.Debug(func(k *logging.Log) {
				k.Format(
					"The log transaction %v for topic 0 is %v, was expecting %v!",
					transactionHash,
					logTopics[0],
					eventSignature,
				)
			})

			return
		}

		rewardData, err := fluidity.DecodeRewardData(log)

		if err != nil {
			logging.Fatal(func(k *logging.Log) {
				k.Message = "Failed to decode reward data from events!"
				k.Payload = err
			})
		}

		winner1, winner2 := microservice_common_track_winners.DecodeWinner(
			logAddress,
			transactionHash,
			rewardData,
			messageReceivedTime,
		)

		tokenDetails := token_details.New(
			underlyingTokenName,
			underlyingTokenDecimals,
		)

		winner1.TokenDetails = tokenDetails
		winner2.TokenDetails = tokenDetails

		queue.SendMessage(winnersPublishTopic, winner1)
		queue.SendMessage(winnersPublishTopic, winner2)

		queue.SendMessage(rewardPublishTopic, rewardData)
	})
}
