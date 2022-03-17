package connector_block_fluid_transactions

import types "github.com/fluidity-money/microservice-lib/types/ethereum"

type LogBody struct {
	JsonRpc string      `json:"jsonrpc"`
	Method  string      `json:"method"`
	Params  []LogParams `json:"params"`
	Id      string      `json:"id"`
}

type LogParams struct {
	Address   string   `json:"address"`
	BlockHash string   `json:"blockHash"`
	Topics    []string `json:"topics"`
}

type LogsResponse struct {
	JsonRpc string      `json:"jsonrpc"`
	Id      string      `json:"id"`
	Result  []types.Log `json:"result"`
}
