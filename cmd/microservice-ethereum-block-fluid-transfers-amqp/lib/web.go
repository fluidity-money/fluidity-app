package microservice_ethereum_block_fluid_transfers_amqp

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	common "github.com/fluidity-money/fluidity-app/common/ethereum"
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
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
		return nil, fmt.Errorf(
			"Could not marshal Geth provider eth_getLogs body: %v",
			err,
		)
	}

	logsReqBody := bytes.NewBuffer(logsReqBody_)

	resp, err := http.Post(gethHttpApi, "application/json", logsReqBody)

	if err != nil {
		return nil, fmt.Errorf(
			"Could not POST to Geth provider: %v",
			err,
		)
	}

	defer resp.Body.Close()

	var logsResponse LogsResponse

	err = json.NewDecoder(resp.Body).Decode(&logsResponse)

	if err != nil {
		return nil, fmt.Errorf(
			"Could not unmarshal response body: %v",
			err,
		)
	}

	return logsResponse.Result, nil
}

func GetBlockFromHash(gethHttpApi, blockHash string) (Block, error) {
	blocksReqParams := BlockParams{
		blockHash,
		true,
	}

	blocksReqBody_, err := json.Marshal(GethBody{
		Method:  "eth_getBlockByHash",
		JsonRpc: "2.0",
		Id:      "1",
		Params:  blocksReqParams,
	})

	if err != nil {
		return Block{}, fmt.Errorf(
			"Could not marshal Geth provider eth_getBlockByNumber body: %v",
			err,
		)
	}

	blocksReqBody := bytes.NewBuffer(blocksReqBody_)

	resp, err := http.Post(gethHttpApi, "application/json", blocksReqBody)

	if err != nil {
		return Block{}, fmt.Errorf(
			"Could not POST to Geth provider: %v",
			err,
		)
	}

	defer resp.Body.Close()

	var blocksResponse BlocksResponse

	err = json.NewDecoder(resp.Body).Decode(&blocksResponse)

	if err != nil {
		return Block{}, fmt.Errorf(
			"Could not unmarshal response body: %v",
			err,
		)
	}

	return blocksResponse.Result, nil
}
