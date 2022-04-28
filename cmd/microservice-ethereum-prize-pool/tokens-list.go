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
	fluidAddress  ethCommon.Address
	tokenName     string
	tokenDecimals *big.Rat
	amount        float64
	// address is the optional parameter for the underlying token address
	// (required for AAVE lookup)
	address       ethCommon.Address
}

func trimWhitespace(s string) string {
	return strings.Trim(s, " \n\t")
}

func getTokensList(tokensList_ string) []TokenDetails {

	tokensList := strings.Split(tokensList_, ",")

	tokenDetails := make([]TokenDetails, len(tokensList))

	for i, tokenInfo_ := range tokensList {

		tokenDetails_ := strings.Split(tokenInfo_, ":")

		if len(tokenDetails_) != 3 && len(tokenDetails_) != 4 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Token information split not structured properly! %#v",
					tokenInfo_,
				)
			})
		}

		var (
			fluidAddress_  = trimWhitespace(tokenDetails_[0])
			tokenName      = trimWhitespace(tokenDetails_[1])
			decimals_      = trimWhitespace(tokenDetails_[2])

			address ethCommon.Address
		)

		// we have the optional address parameter
		if len(tokenDetails_) == 4 {
			address_ := trimWhitespace(tokenDetails_[3])
			address  =  ethCommon.HexToAddress(address_)
		}

		fluidAddress := ethCommon.HexToAddress(fluidAddress_)

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
			fluidAddress:  fluidAddress,
			tokenName:     tokenName,
			tokenDecimals: decimalsRat,
			address:       address,
		}

		tokenDetails[i] = tokenDetail
	}

	return tokenDetails
}
