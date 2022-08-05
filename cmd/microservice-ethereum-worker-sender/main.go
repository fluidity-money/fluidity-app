package main

import (
	"os"
	"strconv"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/ethereum"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
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

	// EnvUseLegacyContract to use the old single reward call instead of the
	// new batchReward call
	EnvUseLegacyContract = `FLU_ETHEREUM_LEGACY_CONTRACT`

	// EnvPublishAmqpQueueName to use to receive RLP-encoded blobs down
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_AMQP_QUEUE_NAME`
)

func main() {
	var (
		contractAddrString   = util.GetEnvOrFatal(EnvContractAddress)
		gethHttpUrl          = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		privateKey_          = util.GetEnvOrFatal(EnvPrivateKey)
		publishAmqpQueueName = util.GetEnvOrFatal(EnvPublishAmqpQueueName)

		useHardhatFix     bool
		useLegacyContract bool
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

	if os.Getenv(EnvUseLegacyContract) == "true" {
		useLegacyContract = true

		log.Debug(func(k *log.Log) {
			k.Message = "Using the legacy contract ABI!"
		})
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

	queue.GetMessages(publishAmqpQueueName, func(message queue.Message) {

		var announcement []worker.EthereumSpooledRewards

		message.Decode(&announcement)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to decode an announcement!"
				k.Payload = err
			})
		}

		rewardTransactionArguments := callRewardArguments{
			containerAnnouncement: announcement,
			transactionOptions:    transactionOptions,
			contractAddress:       contractAddress_,
			client:                ethClient,
			useHardhatFix:         useHardhatFix,
			hardcodedGasLimit:     gasLimit,
		}

		if !useLegacyContract {
			transactionHash, err := callRewardFunction(rewardTransactionArguments)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to call the reward transaction with transaction hash %#v!",
						transactionHash,
					)

					k.Payload = err
				})
			}

			log.App(func(k *log.Log) {
				k.Message = "Successfully called the reward function with hash"
				k.Payload = transactionHash.Hash().Hex()
			})
		} else {
			transactions, err := callLegacyRewardFunction(rewardTransactionArguments)

			if err != nil {
			    log.Fatal(func(k *log.Log) {
			        k.Format(
						"Failed to call the legacy reward function! %v!",
						err,
					)
			    })
			}

			hashes := make([]string, len(transactions))

			for i, transaction := range transactions {
				hashes[i] = transaction.Hash().Hex()
			}

			log.App(func(k *log.Log) {
				k.Message = "Successfully called the legacy reward function with hashes"
				k.Payload = hashes
			})
		}
	})
}
