package main

import (
	"math/big"
	"os"
	"strconv"
	"strings"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/calculation/probability"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/breadcrumb"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvContractAddress is the contract to call when a winner's been found!
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvPrivateKey is the hex-encoded private key used to sign calls to the reward function
	EnvPrivateKey = `FLU_ETHEREUM_WORKER_PRIVATE_KEY`

	// EnvGasLimit to use to manually set the gas limit on chains with bad
	// behaviour. Should be set to 8 million for Ropsten.
	EnvGasLimit = `FLU_ETHEREUM_GAS_LIMIT`

	// EnvUseHardhatFix instead of trying to guess the gas or set it manually
	EnvUseHardhatFix = `FLU_ETHEREUM_HARDHAT_FIX`

	// EnvPublishAmqpQueueName to use to receive RLP-encoded blobs down
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_AMQP_QUEUE_NAME`

	// ethereumNullAddress to filter for not including in either side of a
	// transfer to prevent burning and minting
	ethereumNullAddress = "0000000000000000000000000000000000000000"
)

func main() {
	var (
		contractAddrString   = util.GetEnvOrFatal(EnvContractAddress)
		gethHttpUrl          = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		privateKey_          = util.GetEnvOrFatal(EnvPrivateKey)
		publishAmqpQueueName = util.GetEnvOrFatal(EnvPublishAmqpQueueName)

		useHardhatFix bool
		gasLimit      uint64 = 0
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

	contractAddress_ := ethCommon.HexToAddress(contractAddrString)

	transactionOptions, err := ethereum.NewTransactionOptions(ethClient, privateKey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the transaction options!"
			k.Payload = err
		})
	}

	crumb := breadcrumb.NewBreadcrumb()

	queue.GetMessages(publishAmqpQueueName, func(message queue.Message) {

		defer breadcrumb.SendAndClear(crumb)

		var announcement worker.Announcement

		message.Decode(&announcement)

		var (
			announcementTransactionHash = announcement.TransactionHash
			fromAddress                 = announcement.FromAddress
			toAddress                   = announcement.ToAddress
			sourceRandom                = announcement.SourceRandom
			sourcePayouts               = announcement.SourcePayouts
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to decode an announcement RLP encoded message!"
				k.Payload = err
			})
		}

		// check win status

		winningBalls := probability.NaiveIsWinning(sourceRandom, crumb)

		if winningBalls == 0 {
			log.App(func(k *log.Log) {
				k.Format(
					"From %#v to %#v transaction hash %#v didn't win anything!",
					fromAddress,
					toAddress,
					announcementTransactionHash,
				)
			})

			return
		}

		winningAmount := sourcePayouts[winningBalls-1]

		if winningAmount.Cmp(big.NewInt(1e6)) < 0 {
			log.App(func(k *log.Log) {
				k.Format(
					"From %#v to %#v with transaction hash %#v didn't win more than 1 USD! Won %#v",
					fromAddress,
					toAddress,
					announcementTransactionHash,
					winningAmount,
				)
			})

			return
		}

		if fromAddress == ethereumNullAddress {
			log.App(func(k *log.Log) {
				k.Format(
					"From address was nil in transaction hash %#v! To was set to %#v!",
					announcementTransactionHash,
					toAddress,
				)
			})

			return
		}

		if toAddress == ethereumNullAddress {
			log.App(func(k *log.Log) {
				k.Format(
					"To address was nil in transaction hash %#v! From was set to %#v!",
					announcementTransactionHash,
					fromAddress,
				)
			})

			return
		}

		log.App(func(k *log.Log) {
			k.Format(
				"Transaction hash %#v with transaction from %#v to %#v has won: %v",
				announcementTransactionHash,
				fromAddress,
				toAddress,
				winningAmount,
			)
		})

		rewardTransactionArguments := callRewardArguments{
			containerAnnouncement: announcement,
			transactionOptions:    transactionOptions,
			contractAddress:       contractAddress_,
			client:                ethClient,
			useHardhatFix:         useHardhatFix,
			hardcodedGasLimit:     gasLimit,
		}

		transactionHash, err := callRewardFunction(rewardTransactionArguments)

		if err != nil && strings.Contains(err.Error(), "reward already given for this tx") {
			log.App(func(k *log.Log) {
				k.Format(
					"Reward for transaction hash %#v user was doubled up somehow!",
					announcementTransactionHash,
				)
			})

			return
		}

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to create the reward transaction for transaction hash %#v!",
					transactionHash,
				)

				k.Payload = err
			})
		}

		log.App(func(k *log.Log) {
			k.Message = "Successfully called the reward function with hash"
			k.Payload = transactionHash.Hash().Hex()
		})
	})
}
