package microservice_ethereum_block_fluid_transfers_amqp

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	common "github.com/fluidity-money/fluidity-app/common/ethereum"
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

func GetLogsFromHash(gethHttpApi, blockHash string) (logs []types.Log, err error) {
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

	logsResponseLogs := logsResponse.Result

	logs = make([]types.Log, len(logsResponseLogs))

	for i, log := range logsResponseLogs {
		blockNumber, err := bigIntFromPossiblyHex(log.BlockNumber)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert an outside Ethereum blockNumber to a bigint: %v",
				err,
			)
		}

		index, err := bigIntFromPossiblyHex(log.Index)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert an outside index to a bigint: %v",
				err,
			)
		}

		logTopics := log.Topics

		topics := make([]types.Hash, len(logTopics))

		for i, topic := range logTopics {
			topics[i] = types.Hash(topic)
		}

		txIndex, err := misc.BigIntFromString(log.TxIndex)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert the transaction index to a bigint: %v",
				err,
			)
		}

		data := misc.Blob([]byte(log.Data))

		logs[i] = types.Log{
			Address:     types.Address(log.Address),
			Topics:      topics,
			Data:        data,
			BlockNumber: *blockNumber,
			TxHash:      types.Hash(log.TxHash),
			TxIndex:     *txIndex,
			BlockHash:   types.Hash(log.BlockHash),
			Index:       *index,
			Removed:     log.Removed,
		}
	}

	return logs, nil
}

func GetBlockFromHash(gethHttpApi, blockHash string) (*Block, error) {
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
		return nil, fmt.Errorf(
			"Could not marshal Geth provider eth_getBlockByNumber body: %v",
			err,
		)
	}

	blocksReqBody := bytes.NewBuffer(blocksReqBody_)

	resp, err := http.Post(gethHttpApi, "application/json", blocksReqBody)

	if err != nil {
		return nil, fmt.Errorf(
			"Could not POST to Geth provider: %v",
			err,
		)
	}

	defer resp.Body.Close()

	var blocksResponse BlocksResponse

	err = json.NewDecoder(resp.Body).Decode(&blocksResponse)

	if err != nil {
		return nil, fmt.Errorf(
			"could not unmarshal response body: %v",
			err,
		)
	}

	blockResponseResult := blocksResponse.Result

	return &blockResponseResult, nil
}
