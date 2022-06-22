package main

import (
	"encoding/hex"
	"fmt"

	lib "github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-block-fluid-transfers-amqp/lib"
	ethConvert "github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-block-fluid-transfers-amqp/lib/ethereum"

	common "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	ethQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	workerQueue "github.com/fluidity-money/fluidity-app/lib/queues/worker"
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	worker "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
)

const (
	// EnvGethHttpUrl to use when performing RPC requests
	EnvGethHttpUrl = `FLU_ETHEREUM_HTTP_URL`
)

func convertAddressToBytes(address string) ([]byte, error) {
	prefix := address[:2]
	hexValues := address[2:]

	if prefix != "0x" {
		err := fmt.Errorf("Address does not start with 0x (%v)", address)
		return []byte{}, err
	}

	return hex.DecodeString(hexValues)
}

func main() {
	var gethHttpApi = util.GetEnvOrFatal(EnvGethHttpUrl)

	transferLogTopic, err := convertAddressToBytes(common.TransferLogTopic)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not parse Hex TransferLogTopicAddr!"
			k.Payload = err
		})
	}

	ethQueue.BlockHeaders(func(header ethereum.BlockHeader) {
		var (
			blockHash   = header.BlockHash
			blockNumber = header.Number
			blockBloom  = ethTypes.BytesToBloom(header.Bloom)
		)

		amqpBlock := worker.EthereumBlockLog{
			BlockHash:    blockHash,
			BlockBaseFee: header.BaseFee,
			BlockTime:    header.Time,
			BlockNumber:  blockNumber,
			Logs:         make([]types.Log, 0),
			Transactions: make([]types.Transaction, 0),
		}

		if !blockBloom.Test(transferLogTopic) {

			log.Debug(func(k *log.Log) {
				k.Format("Block %v did NOT contain transfer ABI topic", blockHash)
			})

			queue.SendMessage(workerQueue.TopicEthereumBlockLogs, amqpBlock)

			return
		}

		// Block contains log with ABI hash in its topics
		// Guaranteed to be signature - Order dependent

		log.Debug(func(k *log.Log) {
			k.Format("Block %v contains transfer ABI topic", blockHash.String())
		})

		block, err := lib.GetBlockFromHash(gethHttpApi, blockHash.String())

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get a block using its hash!"
				k.Payload = err
			})
		}

		newTransactions, err := ethConvert.ConvertTransactions(blockHash.String(), block.Transactions)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("Could not convert transactions from block: %v", blockHash)
				k.Payload = err
			})
		}

		amqpBlock.Transactions = append(amqpBlock.Transactions, newTransactions...)

		newFluidLogs, err := lib.GetLogsFromHash(gethHttpApi, blockHash.String())

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("Could not get logs from block: %v", blockHash)
				k.Payload = err
			})
		}

		amqpBlock.Logs = append(amqpBlock.Logs, newFluidLogs...)

		queue.SendMessage(workerQueue.TopicEthereumBlockLogs, amqpBlock)
	})
}
