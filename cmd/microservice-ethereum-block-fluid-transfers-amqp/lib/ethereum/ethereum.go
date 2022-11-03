// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"math/big"

	lib "github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-block-fluid-transfers-amqp/lib"

	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

// emptyAddress to use when a transaction doesn't have a recipient
const emptyAddress = `0x0000000000000000000000000000000000000000`

// ConvertTransaction from Ethereum's definition to our internal one
func ConvertTransaction(tx lib.Transaction) (*types.Transaction, error) {
	var (
		_ = tx.BlockNumber

		chainId              = big.Int(tx.ChainId)
		gas                  = big.Int(tx.Gas)
		gasPrice             = big.Int(tx.GasPrice)
		maxFeePerGas         = big.Int(tx.MaxFeePerGas)
		maxPriorityFeePerGas = big.Int(tx.MaxPriorityFeePerGas)
		nonce                = big.Int(tx.Nonce)
		value                = big.Int(tx.Value)
		typ_                 = big.Int(tx.Type)
	)

	gasPriceAddGas := new(big.Int).Mul(&gasPrice, &gas)

	cost := new(big.Int).Add(gasPriceAddGas, &value)

	typ := uint8(typ_.Int64())

	data := ethCommon.FromHex(tx.Data)

	transaction := types.Transaction{
		BlockHash: tx.BlockHash,
		ChainId:   misc.NewBigIntFromInt(chainId),
		Cost:      misc.NewBigIntFromInt(*cost),
		Data:      data,
		Gas:       gas.Uint64(),
		GasFeeCap: misc.NewBigIntFromInt(maxFeePerGas),
		GasTipCap: misc.NewBigIntFromInt(maxPriorityFeePerGas),
		GasPrice:  misc.NewBigIntFromInt(gasPrice),
		Hash:      tx.Hash,
		Nonce:     nonce.Uint64(),
		To:        tx.To,
		From:      tx.From,
		Type:      typ,
		Value:     misc.NewBigIntFromInt(value),
	}

	return &transaction, nil
}

// ConvertTransactions into their new type definition equivalent
func ConvertTransactions(blockHash string, oldTransactions []lib.Transaction) ([]types.Transaction, error) {
	newTransactions := make([]types.Transaction, len(oldTransactions))

	for i, txn := range oldTransactions {
		tx, err := ConvertTransaction(txn)

		if err != nil {
			return nil, err
		}

		newTransactions[i] = *tx
	}

	return newTransactions, nil
}
