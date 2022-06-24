package util

import (
	"math"
	"math/big"
	"strconv"
	"strings"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

// TokenDetailsBase for the minimum token information, used currently by
// microservice-common-count-wins
type TokenDetailsBase struct {
	TokenAddress  ethCommon.Address
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
		)

		address := ethCommon.HexToAddress(tokenAddress)

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
			TokenAddress:  address,
			TokenName:     tokenName,
			TokenDecimals: decimalsRat,
		}

		tokenDetails[i] = tokenDetail
	}

	return tokenDetails
}
