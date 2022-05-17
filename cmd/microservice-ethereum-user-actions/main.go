package main

import (
	"strconv"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	ethereumTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-user-actions/lib"
)

const (
	// EnvFilterAddress to use to find events published by this contract
	EnvFilterAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvTokenShortName to use when identifying user actions tracked using
	// this microservice
	EnvTokenShortName = `FLU_ETHEREUM_TOKEN_NAME`

	// EnvTokenDecimals to use when sharing user actions made with this token
	// to any downstream consumers who might make a conversion to a float for
	// user representation
	EnvTokenDecimals = `FLU_ETHEREUM_TOKEN_DECIMALS`

	topicUserActions = user_actions.TopicUserActionsEthereum

	networkEthereum = network.NetworkEthereum
)

func main() {
	var (
		filterAddress_ = util.GetEnvOrFatal(EnvFilterAddress)
		tokenShortName = util.GetEnvOrFatal(EnvTokenShortName)
		tokenDecimals_ = util.GetEnvOrFatal(EnvTokenDecimals)
	)

	filterAddress := ethereumTypes.AddressFromString(filterAddress_)

	tokenDecimals, err := strconv.Atoi(tokenDecimals_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to convert %#v to a number!",
				tokenDecimals_,
			)

			k.Payload = err
		})
	}

	ethereum.Logs(func(ethLog ethereum.Log) {
		var (
			transactionHash = ethLog.TxHash
			logTopics       = ethLog.Topics
			logData         = ethLog.Data
			logAddress      = ethLog.Address
		)

		log.DebugFormat(
			"The log address is %v, expecting %v!",
			logAddress,
			filterAddress,
		)

		if logAddress != filterAddress {
			return
		}

		log.Debug(func(k *log.Log) {
			k.Format(
				"The number of log topics is %v, expecting more than 2!",
				len(logTopics),
			)
		})

		if len(logTopics) < 2 {
			return
		}

		var (
			topicHead      = string(logTopics[0])
			topicRemaining = logTopics[1:]
		)

		// handle the respective signatures, each function crashes if bad input

		time := time.Now()

		eventClassification, err := microservice_user_actions.ClassifyEventSignature(
			topicHead,
		)

		if err != nil {
			log.DebugFormat(
				"Didn't decode an event signature on the wire. %v",
				err,
			)

			return
		}

		switch eventClassification {

		case microservice_user_actions.EventTransfer:
			log.DebugFormat(
				"Handling a transfer event, topic head is %#s",
				topicHead,
			)

			handleTransfer(
				transactionHash,
				topicRemaining,
				logData,
				time,
				tokenShortName,
				tokenDecimals,
			)

		case microservice_user_actions.EventMintFluid:
			log.DebugFormat(
				"Handling a minting event, topic head %#v!",
				topicHead,
			)

			handleMint(
				transactionHash,
				topicRemaining,
				time,
				tokenShortName,
				tokenDecimals,
			)

		case microservice_user_actions.EventBurnFluid:
			log.DebugFormat(
				"Handling a burning event, topic head %#v!",
				topicHead,
			)

			handleBurn(
				transactionHash,
				topicRemaining,
				time,
				tokenShortName,
				tokenDecimals,
			)

		default:
			panic(
				"Failed to identify a user action that didn't cause an error!",
			)
		}
	})
}
