package ethereum

import (
	"math"
	"math/big"
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

func trimWhitespace(s string) string {
	return strings.Trim(s, " \n\t")
}

// TokenDetailsEthereum containing information about tokens that we unpacked
// using the environment variables
type TokenDetailsEthereum struct {
	FluidAddress  ethCommon.Address
	TokenName     string
	TokenDecimals *big.Rat
	Amount        float64

	// address is the optional parameter for the underlying token address
	// (required for AAVE lookup) OR the flux oracle address (for Aurora)
	Address ethCommon.Address

	Backend string
}

// GetTokensListEthereum to parse a string list into separated token information
func GetTokensListEthereum(tokensList_ string) []TokenDetailsEthereum {

	tokensList := strings.Split(tokensList_, ",")

	tokenDetails := make([]TokenDetailsEthereum, len(tokensList))

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
			fluidAddress_ = trimWhitespace(tokenDetails_[0])
			tokenName     = trimWhitespace(tokenDetails_[1])
			decimals_     = trimWhitespace(tokenDetails_[2])

			address ethCommon.Address
			backend string
		)

		// we have the optional address parameter

		if len(tokenDetails_) >= 4 {
			address_ := trimWhitespace(tokenDetails_[3])
			address = ethCommon.HexToAddress(address_)
		}

		// we have the optional backend parameter

		if len(tokenDetails_) == 5 {
			backend = trimWhitespace(tokenDetails_[4])
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

		tokenDetail := TokenDetailsEthereum{
			FluidAddress:  fluidAddress,
			TokenName:     tokenName,
			TokenDecimals: decimalsRat,
			Address:       address,
			Backend:       backend,
		}

		tokenDetails[i] = tokenDetail
	}

	return tokenDetails
}
