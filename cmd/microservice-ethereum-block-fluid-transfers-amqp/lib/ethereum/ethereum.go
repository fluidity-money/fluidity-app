// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"fmt"
	"math/big"

	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
)

// emptyAddress to use when a transaction doesn't have a recipient
const emptyAddress = `0x0000000000000000000000000000000000000000`

// ConvertTransaction from Ethereum's definition to our internal one
func ConvertTransaction(blockHash string, oldTransaction *ethTypes.Transaction) (*types.Transaction, error) {
	chainId_ := oldTransaction.ChainId()

	// convert to message to obtain sender address

	signer := ethTypes.NewLondonSigner(chainId_)

	transactionMessage, err := oldTransaction.AsMessage(signer, nil)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get a transaction signer! %v",
			err,
		)
	}

	var (
		chainId   big.Int
		cost      big.Int
		gasPrice  big.Int
		to        string
		gasFeeCap big.Int
		gasTipCap big.Int
		value     big.Int
	)

	if chainId_ != nil {
		chainId = *chainId_
	}

	if cost_ := oldTransaction.Cost(); cost_ != nil {
		cost = *cost_
	}

	if gasPrice_ := oldTransaction.GasPrice(); gasPrice_ != nil {
		gasPrice = *gasPrice_
	}

	if to_ := oldTransaction.To(); to_ != nil {
		to = to_.Hex()
	} else {
		to = emptyAddress
	}

	if gasTipCap_ := oldTransaction.GasTipCap(); gasTipCap_ != nil {
		gasTipCap = *gasTipCap_
	}

	if gasFeeCap_ := oldTransaction.GasFeeCap(); gasFeeCap_ != nil {
		gasFeeCap = *gasFeeCap_
	}

	if value_ := oldTransaction.Value(); value_ != nil {
		value = *value_
	}

	newTransaction := types.Transaction{
		BlockHash: types.HashFromString(blockHash),
		ChainId:   misc.NewBigInt(chainId),
		Cost:      misc.NewBigInt(cost),
		Data:      oldTransaction.Data(),
		Gas:       oldTransaction.Gas(),
		GasFeeCap: misc.NewBigInt(gasFeeCap),
		GasTipCap: misc.NewBigInt(gasTipCap),
		GasPrice:  misc.NewBigInt(gasPrice),
		Hash:      types.HashFromString(oldTransaction.Hash().Hex()),
		Nonce:     oldTransaction.Nonce(),
		To:        types.AddressFromString(to),
		From:      types.AddressFromString(transactionMessage.From().Hex()),
		Type:      oldTransaction.Type(),
		Value:     misc.NewBigInt(value),
	}

	return &newTransaction, nil
}

// ConvertTransactions into their new type definition equivalent
func ConvertTransactions(blockHash string, oldTransactions []*ethTypes.Transaction) ([]types.Transaction, error) {
	newTransactions := make([]types.Transaction, len(oldTransactions))

	for i, txn := range oldTransactions {
		transaction, err := ConvertTransaction(blockHash, txn)

		if err != nil {
			return nil, err
		}

		newTransactions[i] = *transaction
	}

	return newTransactions, nil
}
