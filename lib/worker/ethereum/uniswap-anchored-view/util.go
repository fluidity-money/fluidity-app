package uniswap_anchored_view

import (
	"math/big"
	"fmt"
)

func coerceBoundContractResultsToRat(results []interface{}) (*big.Rat, error) {
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