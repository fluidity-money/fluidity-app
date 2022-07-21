// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package util

import (
	"math"
	"math/big"
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

// TokenDetailsBase for the minimum token information, used currently by
// microservice-common-count-wins
type TokenDetailsBase struct {
	TokenDecimals *big.Rat
	TokenName     string
}

func trimWhitespace(s string) string {
	return strings.Trim(s, " \n\t")
}

// GetTokensListBase starting with the address, token name and decimals
func GetTokensListBase(tokensList_ string) []TokenDetailsBase {
	// addr, name, decimals

	tokensList := strings.Split(tokensList_, ",")

	tokenDetails := make([]TokenDetailsBase, len(tokensList))

	for i, tokenInfo_ := range tokensList {

		tokenDetails_ := strings.Split(tokenInfo_, ":")

		if len(tokenDetails_) < 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Token information split not structured properly! %#v",
					tokenInfo_,
				)
			})
		}

		var (
			_         = trimWhitespace(tokenDetails_[0])
			tokenName = trimWhitespace(tokenDetails_[1])
			decimals_ = trimWhitespace(tokenDetails_[2])
		)

		decimals, err := strconv.Atoi(decimals_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to convert the decimals part of the token info! %#v",
					decimals_,
				)

				k.Payload = err
			})
		}

		decimalsAdjusted := math.Pow10(decimals)

		decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

		tokenDetail := TokenDetailsBase{
			TokenName:     tokenName,
			TokenDecimals: decimalsRat,
		}

		tokenDetails[i] = tokenDetail
	}

	return tokenDetails
}
