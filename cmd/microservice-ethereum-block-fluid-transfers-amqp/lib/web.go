package microservice_ethereum_block_fluid_transfers_amqp

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	common "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func GetLogsFromHash(gethHttpApi, blockHash string) ([]types.Log, error) {
	logsReqParams := LogParams{{
		BlockHash: blockHash,
		Topics:    []string{common.TransferLogTopic},
	}}

	logsReqBody_, err := json.Marshal(GethBody{
		Method:  "eth_getLogs",
		JsonRpc: "2.0",
		Id:      "1",
		Params:  logsReqParams,
	})

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not marshal Geth provider eth_getLogs body"
			k.Payload = err
		})
	}

	logsReqBody := bytes.NewBuffer(logsReqBody_)

	resp, err := http.Post(gethHttpApi, "application/json", logsReqBody)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not POST to Geth provider"
			k.Payload = err
		})
	}

	defer resp.Body.Close()

	var logsResponse LogsResponse

	err = json.NewDecoder(resp.Body).Decode(&logsResponse)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not unmarshal response body"
			k.Payload = err
		})
	}

	return logsResponse.Result, nil
}

func GetBlockFromNumber(gethHttpApi string, blockNumber misc.BigInt) (Block, error) {
	blocksReqParams := BlockParams{
		fmt.Sprintf("0x%x", blockNumber.Uint64()),
		true,
	}

	blocksReqBody_, err := json.Marshal(GethBody{
		Method:  "eth_getBlockByNumber",
		JsonRpc: "2.0",
		Id:      "1",
		Params:  blocksReqParams,
	})

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not marshal Geth provider eth_getBlockByNumber body"
			k.Payload = err
		})
	}

	blocksReqBody := bytes.NewBuffer(blocksReqBody_)

	resp, err := http.Post(gethHttpApi, "application/json", blocksReqBody)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not POST to Geth provider"
			k.Payload = err
		})
	}

	defer resp.Body.Close()

	var blocksResponse BlocksResponse

	err = json.NewDecoder(resp.Body).Decode(&blocksResponse)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not unmarshal response body"
			k.Payload = err
		})
	}

	return blocksResponse.Result, nil
}
