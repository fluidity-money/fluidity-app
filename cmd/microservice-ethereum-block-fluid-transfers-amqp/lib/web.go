// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package microservice_ethereum_block_fluid_transfers_amqp

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	common "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
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
		var (
			logBlockNumber = log.BlockNumber
			logIndex       = log.Index
			logTxIndex     = log.TxIndex
			logData        = log.Data
			blockHash      = log.BlockHash
			address        = log.Address
			txHash         = log.TxHash
		)

		blockNumber, err := common.BigIntFromHex(logBlockNumber)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert an outside Ethereum blockNumber (%#v) to a bigint: %v",
				blockNumber,
				err,
			)
		}

		index, err := common.BigIntFromHex(logIndex)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert an outside index (%#v) to a bigint: %v",
				logIndex,
				err,
			)
		}

		logTopics := log.Topics

		topics := make([]types.Hash, len(logTopics))

		for i, topic := range logTopics {
			topics[i] = types.Hash(topic)
		}

		txIndex, err := common.BigIntFromHex(logTxIndex)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert the transaction index (%#v) to a bigint: %v",
				logTxIndex,
				err,
			)
		}

		data := misc.Blob([]byte(logData))

		logs[i] = types.Log{
			Address:     types.Address(address),
			Topics:      topics,
			Data:        data,
			BlockNumber: *blockNumber,
			TxHash:      types.Hash(txHash),
			TxIndex:     *txIndex,
			BlockHash:   types.Hash(blockHash),
			Index:       *index,
			Removed:     log.Removed,
		}
	}

	return logs, nil
}

func GetBlockFromHash(gethHttpApi, blockHash string, retries int, delay int) (*Block, error) {
	blocksReqParams := BlockParams{
		blockHash,
		true,
	}

	remainingRetries := retries
	for {
		blocksReqBody_, err := json.Marshal(GethBody{
			Method:  "eth_getBlockByHash",
			JsonRpc: "2.0",
			Id:      "1",
			Params:  blocksReqParams,
		})

		if err != nil {
			return nil, fmt.Errorf(
				"could not marshal Geth provider eth_getBlockByNumber body: %v",
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

		if string(blockResponseResult) == "null" {
			// block isn't available
			if remainingRetries > 0 {
					log.Debug(func(k *log.Log) {
						k.Format(
							"Block %s not available yet! sleeping for %d seconds before retrying",
							blockHash,
							delay,
						)
					})

					duration := time.Duration(delay) * time.Second
					time.Sleep(duration)

					remainingRetries--
					continue
			}

			return nil, fmt.Errorf(
				"geth return null for block %v, block doesn't exist! possible geth desync?!",
				blockHash,
			)
		}

		var block Block

		err = json.Unmarshal(blockResponseResult, &block)

		if err != nil {
			return nil, fmt.Errorf(
				"could not unmarshal block resonse, %#v: %v",
				string(blockResponseResult),
				err,
			)
		}

		return &block, nil
	}
}
