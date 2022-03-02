package main

import (
	"math"
	"math/big"
	"strconv"
	"strings"

	ethCommon "github.com/ethereum/go-ethereum/common"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

// TokenDetails containing information about tokens that we unpacked using
// the environment variables
type TokenDetails struct {
	address       ethCommon.Address
	tokenName     string
	tokenDecimals *big.Rat
	amount        float64
}

func trimWhitespace(s string) string {
	return strings.Trim(s, " \n\t")
}

func getTokensList(tokensList_ string) []TokenDetails {

	tokensList := strings.Split(tokensList_, ",")

	tokenDetails := make([]TokenDetails, len(tokensList))

	for i, tokenInfo_ := range tokensList {

		tokenDetails_ := strings.Split(tokenInfo_, ":")

		if len(tokenDetails_) != 3 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Token information split not structured properly! %#v",
					tokenInfo_,
				)
			})
		}

		var (
			address_  = trimWhitespace(tokenDetails_[0])
			tokenName = trimWhitespace(tokenDetails_[1])
			decimals_ = trimWhitespace(tokenDetails_[2])
		)

		address := ethCommon.HexToAddress(address_)

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

		tokenDetail := TokenDetails{
			address:       address,
			tokenName:     tokenName,
			tokenDecimals: decimalsRat,
		}

		tokenDetails[i] = tokenDetail
	}

	return tokenDetails
}
