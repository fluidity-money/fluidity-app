package main

import (
	"bytes"
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"

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
	"github.com/ethereum/go-ethereum/ethclient"
	ethRpc "github.com/ethereum/go-ethereum/rpc"
)

// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
const (
	// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
	EnvEthereumWsUrl = `FLU_ETHEREUM_WS_URL`

	// EnvGethHttpUrl to use when connecting to a node
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
	var (
		gethWebsocketUrl = util.GetEnvOrFatal(EnvEthereumWsUrl)
		gethHttpApi      = util.GetEnvOrFatal(EnvGethHttpUrl)
	)

	transferLogTopic, err := convertAddressToBytes(common.TransferLogTopic)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not parse Hex TransferLogTopicAddr!"
			k.Payload = err
		})
	}

	rpcClient, err := ethRpc.Dial(gethWebsocketUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	gethClient := ethclient.NewClient(rpcClient)

	ethQueue.BlockHeaders(func(header ethereum.BlockHeader) {
		var (
			blockNumber = header.Number
			blockBloom  = ethTypes.BytesToBloom(header.Bloom)
		)

		amqpBlock := worker.BlockLog{
			BlockBaseFee: header.BaseFee,
			BlockTime:    header.Time,
			BlockNumber:  blockNumber,
			Logs:         make([]types.Log, 0),
			Transactions: make([]types.Transaction, 0),
		}

		if !blockBloom.Test(transferLogTopic) {

			log.Debug(func(k *log.Log) {
				k.Format("Block at offset %v did NOT contain transfer ABI topic", blockNumber)
			})

		} else {

			// Block contains log with ABI hash in its topics
			// Guaranteed to be signature - Order dependent

			log.Debug(func(k *log.Log) {
				k.Format("Block at offset %v contains transfer ABI topic", blockNumber)
			})

			block, err := gethClient.BlockByNumber(context.Background(), &blockNumber.Int)

			for tries := 0; err != nil; tries++ {
				if tries >= 10 {
					log.Fatal(func(k *log.Log) {
						k.Format("Could not get block at offset: %v", blockNumber)
						k.Payload = err
					})
				}

				block, err = gethClient.BlockByNumber(context.Background(), &blockNumber.Int)
			}

			var blockHash = block.Hash()

			newTransactions, err := ethConvert.ConvertTransactions(blockHash.Hex(), block.Transactions())

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format("Could not convert transactions from block %v (offset: %v)", blockHash, blockNumber)
					k.Payload = err
				})
			}

			amqpBlock.Transactions = append(amqpBlock.Transactions, newTransactions...)

			logsParams := lib.LogParams{
				BlockHash: blockHash.Hex(),
				Topics:    []string{common.TransferLogTopic},
			}

			logsBody_, err := json.Marshal(lib.LogBody{
				Method:  "eth_getLogs",
				JsonRpc: "2.0",
				Id:      "1",
				Params:  []lib.LogParams{logsParams},
			})

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Could not marshal Geth provider eth_getLogs body"
					k.Payload = err
				})
			}

			logsBody := bytes.NewBuffer(logsBody_)

			resp, err := http.Post(gethHttpApi, "application/json", logsBody)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Could not POST to Geth provider"
					k.Payload = err
				})
			}

			defer resp.Body.Close()

			var logsResponse lib.LogsResponse

			err = json.NewDecoder(resp.Body).Decode(&logsResponse)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Could not unmarshal response body"
					k.Payload = err
				})
			}

			amqpBlock.Logs = append(amqpBlock.Logs, logsResponse.Result...)
		}

		queue.SendMessage(workerQueue.TopicBlockLogs, amqpBlock)
	})

}
