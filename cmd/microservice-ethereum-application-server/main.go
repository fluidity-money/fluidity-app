package main

import (
	"strconv"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvContractAddress is the application contract
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvUnderlyingTokenDecimals supported by the contract
	EnvUnderlyingTokenDecimals = `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`
)

func main() {
	var (
		contractAddrString       = util.GetEnvOrFatal(EnvContractAddress)
		gethHttpUrl              = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
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

	gethClient, err := ethclient.Dial(gethHttpUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	defer gethClient.Close()

	worker.EthereumApplicationEvents(func(applicationEvent worker.EthereumApplicationEvent) {

		var (
			// transfers that generated application events
			applicationTransfers = applicationEvent.ApplicationTransfers

			// the block in question
			applicationBlock = applicationEvent.BlockLog

			// worker server has already found application transfers using the contract in this block
			fluidTransferCount = len(applicationTransfers)

			// transfers that we're adding information to
			decoratedTransfers = make([]worker.EthereumDecoratedTransfer, fluidTransferCount)
		)

		// loop over application events in the block, add payouts as decorator
		for i, transfer := range applicationTransfers {

			fee, err := applications.GetApplicationFee(transfer, gethClient, contractAddress, tokenDecimals)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get the application fee for an application transfer!"
					k.Payload = err
				})
			}

			// nil, nil for a skipped event
			if fee == nil {
				log.App(func(k *log.Log) {
					k.Format(
						"Skipping an application transfer for transaction %#v and application %#v!",
						transfer.Transaction.Hash.String(),
						transfer.Application,
					)
				})

				continue
			}

			toAddress, fromAddress, err := applications.GetApplicationTransferParties(transfer)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get the sender and receiver for an application transfer!"
					k.Payload = err
				})
			}

			decorator := &worker.EthereumWorkerDecorator{
				ApplicationFee: fee,
			}

			decoratedTransfer := worker.EthereumDecoratedTransfer{
				SenderAddress:    fromAddress,
				RecipientAddress: toAddress,
				Decorator:        decorator,
				Transaction:      transfer.Transaction,
			}

			decoratedTransfers[i] = decoratedTransfer
		}

		serverWork := worker.EthereumServerWork{
			EthereumHintedBlock: &worker.EthereumHintedBlock{
				BlockHash:          applicationBlock.BlockHash,
				BlockBaseFee:       applicationBlock.BlockBaseFee,
				BlockTime:          applicationBlock.BlockTime,
				BlockNumber:        applicationBlock.BlockNumber,
				TransferCount:      fluidTransferCount,
				DecoratedTransfers: decoratedTransfers,
			},
		}

		// send to server
		queue.SendMessage(worker.TopicEthereumServerWork, serverWork)
	})
}
