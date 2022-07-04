package main

import (
	"fmt"
	"math/big"
	"strconv"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/oneinch"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/uniswap"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	libEthereum "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
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

			fee, err := getApplicationFee(transfer, gethClient, contractAddress, tokenDecimals)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get the application fee for an application transfer!"
					k.Payload = err
				})
			}

			toAddress, fromAddress, err := getApplicationTransferParties(transfer)

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

// getApplicationFee to find the fee (in USD) paid by a user for the application interaction
func getApplicationFee(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	switch transfer.Application {
	case applications.ApplicationUniswapV2:
		return uniswap.GetUniswapFees(transfer, client, fluidTokenContract, tokenDecimals)
	case applications.ApplicationOneInchLPV2, applications.ApplicationOneInchLPV1:
		return oneinch.GetOneInchLPFees(transfer, client, fluidTokenContract, tokenDecimals)
	case applications.ApplicationMooniswap:
		return oneinch.GetMooniswapV1Fees(transfer, client, fluidTokenContract, tokenDecimals)
	case applications.ApplicationOneInchFixedRateSwap:
		return oneinch.GetFixedRateSwapFees(transfer, client, fluidTokenContract, tokenDecimals)

	default:
		return nil, fmt.Errorf(
			"Transfer #%v did not contain an application",
			transfer,
		)
	}
}

// getApplicationTransferParties to find the parties considered for payout from an application interaction.
// In the case of an AMM (such as Uniswap) the transaction sender receives the majority payout every time,
// with the recipient tokens being effectively burnt (sent to the contract). In the case of a P2P swap,
// such as a DEX, the party sending the fluid tokens receives the majority payout.
func getApplicationTransferParties(transfer worker.EthereumApplicationTransfer) (libEthereum.Address, libEthereum.Address, error) {
	var (
		transaction = transfer.Transaction
		nilAddress  libEthereum.Address
	)

	switch transfer.Application {
	case applications.ApplicationUniswapV2:
		// Give the majority payout to the swap-maker (i.e. transaction sender)
		return transaction.From, transaction.To, nil
	case applications.ApplicationOneInchLPV2,
		applications.ApplicationOneInchLPV1,
		applications.ApplicationMooniswap,
		applications.ApplicationOneInchFixedRateSwap:
		return transaction.From, transaction.To, nil

	default:
		return nilAddress, nilAddress, fmt.Errorf(
			"Transfer #%v did not contain an application",
			transfer,
		)
	}
}
