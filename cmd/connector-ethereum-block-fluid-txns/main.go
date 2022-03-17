package main

import (
	"bytes"
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"

	lib "github.com/fluidity-money/fluidity-app/cmd/connector-ethereum-block-fluid-txns/lib"
	ethConvert "github.com/fluidity-money/fluidity-app/cmd/connector-ethereum-block-fluid-txns/lib/ethereum"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	workerQueue "github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	worker "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	ethRpc "github.com/ethereum/go-ethereum/rpc"
)

// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
const (
	// TransferLogTopicAddr to use to filter for transfer signatures
	TransferLogTopicAddr = `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`

	// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
	EnvEthereumWsUrl = `FLU_ETHEREUM_WS_URL`

	// EnvEthereumContractAddress to use when monitoring for transfers
	EnvEthereumContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

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

	transferLogTopic, err := convertAddressToBytes(TransferLogTopicAddr)

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

	headers := make(chan *ethTypes.Header)

	newHeadsSubscription, err := gethClient.SubscribeNewHead(
		context.Background(),
		headers,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not subscribe to New Blocks!"
			k.Payload = err
		})
	}

	defer newHeadsSubscription.Unsubscribe()

	for {
		select {
		case err := <-newHeadsSubscription.Err():
			log.Fatal(func(k *log.Log) {
				k.Message = "NewHeads subscription returned an error!"
				k.Payload = err
			})

		case header := <-headers:
			blockHash := header.Hash()

			newHeader := ethConvert.ConvertHeader(header)

			blockNumber := newHeader.Number.Uint64()

			log.Debug(func(k *log.Log) {
				k.Format("Found block %s", blockHash)
			})

			amqpBlock := worker.BlockLog{
				BlockHash:    ethereum.HashFromString(blockHash.Hex()),
				BlockBaseFee: newHeader.BaseFee,
				BlockTime:    newHeader.Time,
				BlockNumber:  blockNumber,
				Logs:         make([]types.Log, 0),
				Transactions: make([]types.Transaction, 0),
			}

			if !header.Bloom.Test(transferLogTopic) {
				log.Debug(func(k *log.Log) {
					k.Format("Block %v did NOT contain transfer ABI topic", blockHash)
				})
			} else {
				log.Debug(func(k *log.Log) {
					k.Format("Block %v contains transfer ABI topic", blockHash)
				})
				block, err := gethClient.BlockByHash(context.Background(), blockHash)

				for tries := 0; err != nil; tries++ {
					if tries >= 10 {
						log.Fatal(func(k *log.Log) {
							k.Format("Could not get block from hash: %v", blockHash)
							k.Payload = err
						})
					}
				}

				newTransactions, err := ethConvert.ConvertTransactions(blockHash.Hex(), block.Transactions())

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Format("Could not convert transactions from block %v", blockHash)
						k.Payload = err
					})
				}

				amqpBlock.Transactions = append(amqpBlock.Transactions, newTransactions...)

				// Block contains log with ABI hash in its topics
				// Guaranteed to be signature - Order dependent
				logsParams := lib.LogParams{
					BlockHash: blockHash.Hex(),
					Topics:    []string{TransferLogTopicAddr},
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
		}

	}
}
