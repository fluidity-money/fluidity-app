// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"fmt"

	lib "github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-block-fluid-transfers-amqp/lib"

	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

const (
	// emptyAddress to use when a transaction doesn't have a recipient
	emptyAddress = `0x0000000000000000000000000000000000000000`

	// list of transaction types we understand
	txLegacy             = 0
	txAccessList         = 1
	txDynamicFee         = 2
	txArbDeposit         = 100 // deposit, ignore
	txArbUnsigned        = 101 // bridge tx
	txArbContract        = 102 // bridge tx
	txArbRetry           = 104 // retryable tx execution
	txArbSubmitRetryable = 105 // retryable tx submition, ignore
	txArbInternal        = 106 // internal, ignore
	txArbLegacy          = 120 // same as eth legacy
)

func shouldIgnoreTransaction(typ uint8) (bool, error) {
	switch (typ) {
	case txArbDeposit, txArbSubmitRetryable, txArbInternal:
		return true, nil
	case txLegacy, txAccessList, txDynamicFee, txArbUnsigned, txArbContract, txArbRetry, txArbLegacy:
		return false, nil
	default:
		return true, fmt.Errorf("unknown transaction type %d", typ)
	}
}

// ConvertTransaction from Ethereum's definition to our internal one
func ConvertTransaction(tx lib.Transaction) (*types.Transaction, error) {
	var (
		_ = tx.BlockNumber

		gasPrice             = tx.GasPrice.Int
		maxFeePerGas         = tx.MaxFeePerGas.Int
		maxPriorityFeePerGas = tx.MaxPriorityFeePerGas.Int
		typ_                 = tx.Type.Int
	)

	typ := uint8(typ_.Int64())

	data := ethCommon.FromHex(tx.Data)

	transaction := types.Transaction{
		BlockHash: tx.BlockHash,
		Data:      data,
		GasFeeCap: misc.NewBigIntFromInt(maxFeePerGas),
		GasTipCap: misc.NewBigIntFromInt(maxPriorityFeePerGas),
		GasPrice:  misc.NewBigIntFromInt(gasPrice),
		Hash:      tx.Hash,
		To:        tx.To,
		From:      tx.From,
		Type:      typ,
	}

	return &transaction, nil
}

// ConvertTransactions into their new type definition equivalent
func ConvertTransactions(blockHash string, oldTransactions []lib.Transaction) ([]types.Transaction, error) {
	newTransactions := make([]types.Transaction, 0)

	for _, txn := range oldTransactions {
		typ := uint8(txn.Type.Uint64())

		ignore, err := shouldIgnoreTransaction(typ)

		if err != nil {
			return nil, fmt.Errorf(
				"Error converting transactions for transaction hash %s: %w",
				txn.Hash.String(),
				err,
			)
		}

		if ignore {
			log.Debug(func(k *log.Log) {
			    k.Format("Skipping transaction %s with irrelevant type %d", txn.Hash, typ)
			})

			continue
		}

		tx, err := ConvertTransaction(txn)

		if err != nil {
			return nil, err
		}

		newTransactions = append(newTransactions, *tx)
	}

	return newTransactions, nil
}
