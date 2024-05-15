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
// microservice-common-count-wins. TokenDecimals is in its exponential
// form (ie, 1e18)
type TokenDetailsBase struct {
	TokenAddress  string
	TokenDecimals *big.Rat
	TokenName     string

	// Extras is anything off to the right, in it's string format.
	Extras []string
}

func trimWhitespace(s string) string {
	return strings.Trim(s, " \n\t")
}

// NewTokenDetailsBase with the name and number to turn into an
// exponential number (ie if given 10, will go 1e10)
func NewTokenDetailsBase(address, name string, decimals int, extras ...string) TokenDetailsBase {
	decimalsAdjusted := math.Pow10(decimals)

	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	return TokenDetailsBase{
		TokenAddress:  address,
		TokenName:     name,
		TokenDecimals: decimalsRat,
		Extras:        extras,
	}
}

// GetTokensListBase starting with the address, token name and decimals
func GetTokensListBase(tokensList_ string) []TokenDetailsBase {

	tokensList := strings.Split(tokensList_, ",")

	tokenDetails := make([]TokenDetailsBase, len(tokensList))

	for i, tokenInfo_ := range tokensList {

		tokenDetails_ := strings.Split(tokenInfo_, ":")

		if len(tokenDetails_) < 3 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Token information split not structured properly! %#v",
					tokenInfo_,
				)
			})
		}

		var (
			tokenAddress = trimWhitespace(tokenDetails_[0])
			tokenName    = trimWhitespace(tokenDetails_[1])
			decimals_    = trimWhitespace(tokenDetails_[2])
			extras       = tokenDetails_[3:]
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

		tokenDetails[i] = NewTokenDetailsBase(tokenAddress, tokenName, decimals, extras...)
	}

	return tokenDetails
}
