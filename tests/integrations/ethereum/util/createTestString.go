package test_utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

type (
	GethBody struct {
		JsonRpc string      `json:"jsonrpc"`
		Method  string      `json:"method"`
		Params  interface{} `json:"params"`
		Id      string      `json:"id"`
	}

	LogParams [1]struct {
		BlockHash string   `json:"blockHash"`
		Topics    []string `json:"topics"`
	}

	Log struct {
		Address          string   `json:"address"`
		BlockHash        string   `json:"blockHash"`
		BlockNumber      string   `json:"blockNumber"`
		Data             string   `json:"data"`
		LogIndex         string   `json:"logIndex"`
		Removed          bool     `json:"removed"`
		Topics           []string `json:"topics"`
		TransactionHash  string   `json:"transactionHash"`
		TransactionIndex string   `json:"transactionIndex"`
	}

	LogsResponse struct {
		JsonRpc string `json:"jsonrpc"`
		Id      string `json:"id"`
		Result  []Log  `json:"result"`
	}

	TransactionParams [1]string

	TransactionRes struct {
		Jsonrpc string `json:"jsonrpc"`
		ID      string `json:"id"`
		Result  struct {
			BlockHash        string `json:"blockHash"`
			BlockNumber      string `json:"blockNumber"`
			From             string `json:"from"`
			Gas              string `json:"gas"`
			GasPrice         string `json:"gasPrice"`
			Hash             string `json:"hash"`
			Input            string `json:"input"`
			Nonce            string `json:"nonce"`
			R                string `json:"r"`
			S                string `json:"s"`
			To               string `json:"to"`
			TransactionIndex string `json:"transactionIndex"`
			Type             string `json:"type"`
			V                string `json:"v"`
			Value            string `json:"value"`
		} `json:"result"`
	}

	TestStructure struct {
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
)

const gethHttpApi = "https://main-rpc.linkpool.io"

func main() {
	args := os.Args

	if len(args) != 3 {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Expected two arguments containing TransactionHex, LogSignature got %d",
				len(args),
			)
		})
	}

	var (
		transactionHex = args[1]
		logSignature   = args[2]
	)

	transactionReqParams := TransactionParams{
		transactionHex,
	}

	gethBody_ := GethBody{
		Method:  "eth_getTransactionByHash",
		JsonRpc: "2.0",
		Id:      "1",
		Params:  transactionReqParams,
	}

	transactionReqBody_, err := json.Marshal(gethBody_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not marshal Geth provider eth_getTransaction body"
			k.Payload = err
		})
	}

	transactionReqBody := bytes.NewBuffer(transactionReqBody_)

	resp, err := http.Post(gethHttpApi, "application/json", transactionReqBody)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not POST to Geth provider"
			k.Payload = err
		})
	}

	defer resp.Body.Close()

	var transactionResp TransactionRes

	err = json.NewDecoder(resp.Body).Decode(&transactionResp)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to marshal blob to JSON!"
			k.Payload = err
		})
	}

	transaction := transactionResp.Result

	blockHash := transaction.BlockHash

	logsReqParams := LogParams{{
		BlockHash: blockHash,
		Topics:    []string{logSignature},
	}}

	gethBody_.Method = "eth_getLogs"
	gethBody_.Params = logsReqParams

	logsReqBody_, err := json.Marshal(gethBody_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not marshal Geth provider eth_getTransaction body"
			k.Payload = err
		})
	}

	logsReqBody := bytes.NewBuffer(logsReqBody_)

	resp, err = http.Post(gethHttpApi, "application/json", logsReqBody)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not POST to Geth provider"
			k.Payload = err
		})
	}

	var logsResp LogsResponse

	err = json.NewDecoder(resp.Body).Decode(&logsResp)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to LogsResp blob to JSON!"
			k.Payload = err
		})
	}

	tests := make([]TestStructure, 0)

	for _, log := range logsResp.Result {
		if log.TransactionHash == transactionHex {
			var test TestStructure

			test.Transfer.Log.Data = decodeHexToB64(log.Data)
			test.Transfer.Log.Address = log.Address
			test.Transfer.Log.Topics = log.Topics

			test.Transfer.Transaction.To = transaction.To
			test.Transfer.Transaction.From = transaction.From
			test.Transfer.Transaction.Hash = log.TransactionHash

			tests = append(tests, test)
		}
	}

	prettyTests, _ := json.Marshal(tests)
	fmt.Println(string(prettyTests))
}
