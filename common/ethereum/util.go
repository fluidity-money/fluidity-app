package ethereum

import (
	"fmt"
	"math/big"
	"context"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethClient "github.com/ethereum/go-ethereum/ethclient"
	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

func Debug(format string, content ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Format(format, content...)
	})
}

func BigIntFromUint64(x uint64) (int *big.Int) {
	int = new(big.Int)

	int.SetUint64(x)

	return
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

func CoerceBoundContractResultsToAddress(results []interface{}) (ethCommon.Address, error) {
	var	result ethCommon.Address

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
