// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"context"
	"fmt"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	ethClient "github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func BigIntFromUint64(x uint64) (int *big.Int) {
	int = new(big.Int)

	int.SetUint64(x)

	return
}

func BigIntFromHex(s string) (*misc.BigInt, error) {
	int, err := hexutil.DecodeBig(s)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to decode a bigint from hex: %v",
			err,
		)
	}

	bigInt := misc.NewBigIntFromInt(*int)

	return &bigInt, nil
}

func CoerceBoundContractResultsToRat(results []interface{}) (*big.Rat, error) {
	var result *big.Int

	if resultsLen := len(results); resultsLen != 1 {
		return nil, fmt.Errorf(
			"returned results did not have length of 1! was %#v!",
			resultsLen,
		)
	}

	switch results[0].(type) {
	case *big.Int:
		result = results[0].(*big.Int)

	default:
		return nil, fmt.Errorf(
			"failed to coerce the return value from balanceOfUnderlying to a *big.Int!",
		)
	}

	if result == nil {
		return nil, fmt.Errorf("*big.Int returned was empty!")
	}

	resultRat := new(big.Rat).SetInt(result)

	return resultRat, nil
}

// Wrap CoerceBoundContractResultsToRat to handle an array of results
func CoerceBoundContractResultsToRats(results []interface{}) ([]*big.Rat, error) {
	var (
		rats = make([]*big.Rat, len(results))

		// coercion function expects a slice with 1 element
		wrapped = make([]interface{}, 1)
	)

	for i, result := range results {
		wrapped[0] = result

		resultRat, err := CoerceBoundContractResultsToRat(wrapped)

		if err != nil {
			return nil, err
		}

		rats[i] = resultRat
	}

	return rats, nil
}

func CoerceBoundContractResultsToAddress(results []interface{}) (ethCommon.Address, error) {
	var result ethCommon.Address

	if resultsLen := len(results); resultsLen != 1 {
		return result, fmt.Errorf(
			"returned results did not have length of 1! was %v",
			resultsLen,
		)
	}

	result, ok := results[0].(ethCommon.Address)

	if !ok {
		return result, fmt.Errorf("results did not contain an address!")
	}

	return result, nil
}

// Wrap CoerceBoundContractResultsToRat to handle an array of results
func CoerceBoundContractResultsToAddresses(results []interface{}) ([]ethCommon.Address, error) {
	var (
		addresses = make([]ethCommon.Address, len(results))

		// coercion function expects a slice with 1 element
		wrapped = make([]interface{}, 1)
	)

	for i, result := range results {
		wrapped[0] = result

		resultAddr, err := CoerceBoundContractResultsToAddress(wrapped)

		if err != nil {
			return nil, err
		}

		addresses[i] = resultAddr
	}

	return addresses, nil
}

func CoerceBoundContractResultsToUint8(results []interface{}) (uint8, error) {
	var result uint8

	if resultsLen := len(results); resultsLen != 1 {
		return result, fmt.Errorf(
			"returned results did not have length of 1! was %v",
			resultsLen,
		)
	}

	result, ok := results[0].(uint8)

	if !ok {
		return result, fmt.Errorf("results did not contain an uint8!")
	}

	return result, nil
}

func BigPow(left *big.Rat, count int) *big.Rat {

	if count == 0 {
		return big.NewRat(1, 1)
	}

	leftCopy_ := *left
	leftCopy := &leftCopy_

	leftOriginal_ := *left
	leftOriginal := &leftOriginal_

	if count > 0 {
		for i := 1; i < count; i++ {
			leftCopy = new(big.Rat).Mul(leftCopy, leftOriginal)
		}
	} else {
		for i := -1; i > count; i-- {
			leftCopy = new(big.Rat).Mul(leftCopy, leftOriginal)
		}

		leftCopy.Inv(leftCopy)
	}

	return leftCopy
}

func StaticCall(client *ethClient.Client, address ethCommon.Address, abi ethAbi.ABI, method string, args ...interface{}) ([]interface{}, error) {
	boundContract := ethBind.NewBoundContract(
		address,
		abi,
		client,
		client,
		client,
	)

	opts := ethBind.CallOpts{
		Pending: false,
		Context: context.Background(),
	}

	var results []interface{}

	err := boundContract.Call(
		&opts,
		&results,
		method,
		args...,
	)

	if err != nil {
		return results, fmt.Errorf(
			"failed to call method %s on bound contract at address %s! %w",
			method,
			address,
			err,
		)
	}

	return results, nil
}

// CalculateEffectiveGasPrice with baseFeePerGas + min(maxFeePerGas -
// baseFeePerGas, maxPriorityFeePerGas)
func CalculateEffectiveGasPrice(baseFeePerGas, maxFeePerGas, maxPriorityFeePerGas *big.Rat) *big.Rat {
	maxFeePerGasMinBaseFeePerGas := new(big.Rat).Sub(maxFeePerGas, baseFeePerGas)

	v := new(big.Rat)

	if maxPriorityFeePerGas.Cmp(maxFeePerGasMinBaseFeePerGas) > 0 {
		v.Add(baseFeePerGas, maxFeePerGasMinBaseFeePerGas)
	} else {
		v.Add(baseFeePerGas, maxPriorityFeePerGas)
	}

	return v
}
