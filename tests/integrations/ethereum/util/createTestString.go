// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

type TestStructure struct {
	Transfer struct {
		Transaction ethTypes.Hash `json:"transaction"`
		Log struct {
			Data    string           `json:"data"`
			Address ethTypes.Address `json:"address"`
			Topics  []ethTypes.Hash  `json:"topics"`
		} `json:"log"`
		Application int `json:"application"`
	} `json:"transfer"`
	Transaction struct {
		To   ethTypes.Address `json:"to"`
		From ethTypes.Address `json:"from"`
		Hash ethTypes.Hash    `json:"hash"`
	} `json:"transaction"`
	ExpectedSender    string `json:"expected_sender"`
	ExpectedRecipient string `json:"expected_recipient"`
	ExpectedFees      string `json:"expected_fees"`
	TokenDecimals     int    `json:"token_decimals"`
	ContractAddress   string `json:"contract_address"`
}

const EnvEthereumRpcUrl = `FLU_ETHEREUM_RPC_URL`

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

	gethHttpApi := util.GetEnvOrFatal(EnvEthereumRpcUrl)

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

			err := fetchTransactionValues(testChan, ethClient, transactionHex, swapSignature)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format("could not fetch all values from tx %v!", transactionHex)
					k.Payload = err
				})
			}
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
func fetchTransactionValues(testChan chan TestStructure, ethClient *ethclient.Client, transactionHash, swapSignature ethcommon.Hash) error {
	txReceipt, err := ethClient.TransactionReceipt(context.Background(), transactionHash)

	if err != nil {
		return fmt.Errorf(
			"Couldn't fetch receipt from %v! %v",
			transactionHash.String(),
			err,
		)
	}

	var (
		blockHash   = txReceipt.BlockHash
		blockNumber = txReceipt.BlockNumber
		txHash      = txReceipt.TxHash
		logs        = txReceipt.Logs
	)

	transaction, _, err := ethClient.TransactionByHash(context.Background(), transactionHash)

	if err != nil {
		return fmt.Errorf(
			"Couldn't fetch transaction from %v! %v",
			transactionHash.String(),
			err,
		)
	}

	sender, err := ethClient.TransactionSender(context.Background(), transaction, blockHash, uint(blockNumber.Uint64()))

	if err != nil {
		return fmt.Errorf(
			"Couldn't get TransactionSender from tx %v, blockHash %v, blockNum %v! %v",
			transactionHash.String(),
			blockHash.String(),
			blockNumber,
			err,
		)
	}

	for _, log := range logs {

		logSignature := log.Topics[0]

		if logSignature == swapSignature {
			var test TestStructure
			test.Transfer.Log.Data = base64.StdEncoding.EncodeToString(log.Data)
			test.Transfer.Log.Address = ethereum.ConvertGethAddress(log.Address)

			testTopics := make([]ethTypes.Hash, 0)
			for _, topic := range log.Topics {
				testTopics = append(testTopics, ethereum.ConvertGethHash(topic))
			}
			test.Transfer.Log.Topics = testTopics

			test.Transaction.To = ethereum.ConvertGethAddress(*transaction.To())
			test.Transaction.From = ethereum.ConvertGethAddress(sender)
			test.Transaction.Hash = ethereum.ConvertGethHash(txHash)
			test.Transfer.Transaction = ethereum.ConvertGethHash(txHash)

			testChan <- test
		}
	}

	return nil
}
