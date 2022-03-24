package microservice_ethereum_block_fluid_transfers_amqp

import (
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
)

type GethBody struct {
	JsonRpc string      `json:"jsonrpc"`
	Method  string      `json:"method"`
	Params  interface{} `json:"params"`
	Id      string      `json:"id"`
}

type LogParams [1]struct {
	Address   string   `json:"address"`
	BlockHash string   `json:"blockHash"`
	Topics    []string `json:"topics"`
}

type BlockParams [2]interface{}

type LogsResponse struct {
	JsonRpc string      `json:"jsonrpc"`
	Id      string      `json:"id"`
	Result  []types.Log `json:"result"`
}

// Block is eth_getBlockByHash's result. Does not match
// ethereum's internal Block structure
type Block struct {
	Difficulty       string                `json:"difficulty"`
	ExtraData        string                `json:"extraData"`
	GasLimit         string                `json:"gasLimit"`
	GasUsed          string                `json:"gasUsed"`
	Hash             types.Address         `json:"hash"`
	LogsBloom        string                `json:"logsBloom"`
	Miner            string                `json:"miner"`
	MixHash          string                `json:"mixHash"`
	Nonce            string                `json:"nonce"`
	Number           string                `json:"number"`
	ParentHash       string                `json:"parentHash"`
	ReceiptsRoot     string                `json:"receiptsRoot"`
	Sha3Uncles       string                `json:"sha3Uncles"`
	Size             string                `json:"size"`
	StateRoot        string                `json:"stateRoot"`
	Timestamp        string                `json:"timestamp"`
	TotalDifficulty  string                `json:"totalDifficulty"`
	Transactions     ethTypes.Transactions `json:"transactions"`
	TransactionsRoot string                `json:"transactionsRoot"`
	Uncles           []interface{}         `json:"uncles"`
}

type BlocksResponse struct {
	JsonRpc string `json:"jsonrpc"`
	Id      string `json:"id"`
	Result  Block  `json:"result"`
}
