package main

import (
	"fmt"
	"math/big"
	"strings"
)

func tokensListToMap(list string) (map[string]*big.Int, error) {
	tokens := make(map[string]*big.Int, 0)

	for _, tokenInfo := range strings.Split(list, ",") {
		tokenSplit := strings.Split(tokenInfo, ",")

		var (
			_              = tokenSplit[0]
			tokenShortName = tokenSplit[1]
			decimals_      = tokenSplit[2]
		)

		decimals, success := new(big.Int).SetString(decimals_, 10)

		if !success {
			return nil, fmt.Errorf(
				"failed to decode the decimals in the block %v: %v",
				tokenInfo,
			)
		}

		tokens[tokenShortName] = decimals
	}

	return tokens, nil
}
