// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

// ethereum contains the types that we use for tracking Ethereum on-chain
// state

import (
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

// Some of the less complicated types that shadow the definition provided
// by Go Ethereum.
type (
	Address    string
	Hash       string
	BlockNonce []byte
)

type (
	// BlockHeader contained within a block on Ethereum, may be forked
	BlockHeader struct {
		BlockHash       Hash        `json:"block_hash"`
		ParentHash      Hash        `json:"parent_hash"`
		UncleHash       Hash        `json:"uncle_hash"`
		Coinbase        Address     `json:"coinbase"`
		Root            Hash        `json:"root"`
		TransactionHash Hash        `json:"transaction_hash"`
		Bloom           misc.Blob   `json:"bloom"`
		Difficulty      misc.BigInt `json:"difficulty"`
		Number          misc.BigInt `json:"number"`
		GasLimit        misc.BigInt `json:"gas_limit"`
		GasUsed         misc.BigInt `json:"gas_used"`
		Time            uint64      `json:"time"`
		Extra           misc.Blob   `json:"extra"`
		MixDigest       Hash        `json:"mix_digest"`
		Nonce           BlockNonce  `json:"nonce"`
		ReceiptHash     Hash        `json:"receipt_hash"`
		BaseFee         misc.BigInt `json:"base_fee"`
	}

	// Transaction made on Ethereum, may be forked
	Transaction struct {
		BlockHash Hash        `json:"block_hash"`
		Data      misc.Blob   `json:"data"`

		// GasFeeCap is the maxFeePerGas
		GasFeeCap misc.BigInt `json:"gas_fee_cap"`

		// GasTipCap is the maxPriorityFeePerGas
		GasTipCap misc.BigInt `json:"gas_tip_cap"`

		GasPrice  misc.BigInt `json:"gas_price"`
		Hash      Hash        `json:"hash"`
		To        Address     `json:"to"`
		From      Address     `json:"from"`
		Type      uint8       `json:"type"`
	}

	// Log represents a contract event log that we have confirmed isn't removed
	Log struct {
		// address of the contract that generated the event
		Address Address `json:"address"`

		// list of topics provided by the contract.
		Topics []Hash `json:"topics"`

		// supplied by the contract, usually ABI-encoded
		Data misc.Blob `json:"data"`

		// block in which the transaction was included
		BlockNumber misc.BigInt `json:"block_number"`

		// hash of the transaction
		TxHash Hash `json:"transaction_hash"`

		// index of the transaction in the block
		TxIndex misc.BigInt `json:"transaction_index"`

		// hash of the block in which the transaction was included
		BlockHash Hash `json:"block_hash"`

		// index of the log in the block
		Index misc.BigInt `json:"log_index"`

		// whether the log was removed due to a chain reorganisation!
		Removed bool `json:"removed"`
	}

	// Receipt is the type returned when you use ethclient TransactionReceipt
	// on a transaction
	Receipt struct {
		Type              uint8       `json:"type"`
		PostState         misc.Blob   `json:"root"`
		Status            uint64      `json:"status"`
		CumulativeGasUsed uint64      `json:"cumulative_gas_used"`
		Bloom             misc.Blob   `json:"logs_bloom"`
		Logs              []Log       `json:"logs"`
		TransactionHash   Hash        `json:"transaction_hash"`
		ContractAddress   Address     `json:"contract_address"`
		GasUsed           misc.BigInt `json:"gas_used"`
		BlockHash         Hash        `json:"block_hash"`
		BlockNumber       misc.BigInt `json:"block_number"`
		TransactionIndex  uint        `json:"transaction_index"`
	}
)

// HashFromString, taking the string and making it lowercase then coercing
func HashFromString(str string) Hash {
	hash := strings.ToLower(str)

	return Hash(hash)
}

// AddressFromString, taking the string and making it lowercase then
// coercing
func AddressFromString(str string) Address {
	address := strings.ToLower(str)

	return Address(address)
}

func (hash Hash) String() string {
	return string(hash)
}

func (address Address) String() string {
	return string(address)
}
