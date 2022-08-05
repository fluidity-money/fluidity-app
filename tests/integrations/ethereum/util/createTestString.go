package test_utils

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"sync"

	ethcommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

type TestStructure struct {
	Transfer struct {
		Log struct {
			Data    string   `json:"data"`
			Address string   `json:"address"`
			Topics  []string `json:"topics"`
		} `json:"log"`
		Transaction struct {
			To   string `json:"to"`
			From string `json:"from"`
			Hash string `json:"hash"`
		} `json:"transaction"`
		Application int `json:"application"`
	} `json:"transfer"`
	ExpectedSender    string `json:"expected_sender"`
	ExpectedRecipient string `json:"expected_recipient"`
	ExpectedFees      string `json:"expected_fees"`
	TokenDecimals     int    `json:"token_decimals"`
	ContractAddress   string `json:"contract_address"`
}

const gethHttpApi = "https://main-rpc.linkpool.io"

func main() {
	args := os.Args

	if len(args) < 3 {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Expected arguments containing LogSignature, Transaction Signature(s) got %d",
				len(args),
			)
		})
	}

	swapSignature := ethcommon.HexToHash(args[1])

	testChan := make(chan TestStructure)

	tests := make([]TestStructure, 0)

	txJobs := new(sync.WaitGroup)

	ethClient, err := ethclient.Dial(gethHttpApi)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("could not dial eth rpc url %v!", gethHttpApi)
			k.Payload = err
		})
	}

	for txIndex := 2; txIndex < len(args); txIndex++ {

		transactionHex := ethcommon.HexToHash(args[txIndex])

		txJobs.Add(1)

		go func() {
			defer txJobs.Done()

			fetchTransactionValues(testChan, ethClient, transactionHex, swapSignature)
		}()

	}

	// Seperate Goroutine allows channel to be read before closing
	go func() {
		txJobs.Wait()

		close(testChan)
	}()

	for test := range testChan {
		tests = append(tests, test)
	}

	prettyTests, _ := json.Marshal(tests)
	fmt.Println(string(prettyTests))
}

// fetchTransactionValues uses ethClient to find Data, Address, Topics, Sender, Recipient and TxHash
// to fill in TestStructure.
// May return multiple relevant Logs per call
func fetchTransactionValues(testChan chan TestStructure, ethClient *ethclient.Client, transactionHash, swapSignature ethcommon.Hash) {
	txReceipt, err := ethClient.TransactionReceipt(context.Background(), transactionHash)

	var (
		blockHash   = txReceipt.BlockHash
		blockNumber = txReceipt.BlockNumber
		txHash      = txReceipt.TxHash
		logs        = txReceipt.Logs
	)

	transaction, _, err := ethClient.TransactionByHash(context.Background(), transactionHash)

	sender, _ := ethClient.TransactionSender(context.Background(), transaction, blockHash, uint(blockNumber.Uint64()))

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not POST to Geth provider"
			k.Payload = err
		})
	}

	for _, log := range logs {

		logSignature := log.Topics[0]

		if logSignature == swapSignature {
			var test TestStructure

			test.Transfer.Log.Data = base64.RawStdEncoding.EncodeToString(log.Data)
			test.Transfer.Log.Address = log.Address.String()

			testTopics := test.Transfer.Log.Topics
			for _, topic := range log.Topics {
				testTopics = append(testTopics, topic.String())
			}

			test.Transfer.Transaction.To = transaction.To().String()
			test.Transfer.Transaction.From = sender.String()
			test.Transfer.Transaction.Hash = txHash.String()

			testChan <- test
		}
	}
}
