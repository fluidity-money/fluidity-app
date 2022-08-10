package solana

import (
	"math"
	"math/big"
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

// TokenDetailsSolana containing information about tokens that we unpacked using
// the environment variables
type TokenDetailsSolana struct {
	FluidMintPubkey   PublicKey
	ObligationPubkey  PublicKey
	ReservePubkey     PublicKey
	PythPubkey        PublicKey
	SwitchboardPubkey PublicKey
	TokenDecimals     *big.Rat
	TokenName         string
	Amount            float64
}

func trimWhitespace(s string) string {
	return strings.Trim(s, " \n\t")
}

// GetTokensListSolana to parse a string list into separated token information
func GetTokensListSolana(tokensList_ string) []TokenDetailsSolana {
	tokensList := strings.Split(tokensList_, ",")

	tokenDetails := make([]TokenDetailsSolana, len(tokensList))

	for i, tokenInfo_ := range tokensList {

		tokenDetails_ := strings.Split(tokenInfo_, ":")

		if len(tokenDetails_) < 7 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Token information split not structured properly! %#v",
					tokenInfo_,
				)
			})
		}

		var (
			fluidMint_   = trimWhitespace(tokenDetails_[0])
			tokenName    = trimWhitespace(tokenDetails_[1])
			decimals_    = trimWhitespace(tokenDetails_[2])
			obligation_  = trimWhitespace(tokenDetails_[3])
			reserve_     = trimWhitespace(tokenDetails_[4])
			pyth_        = trimWhitespace(tokenDetails_[5])
			switchboard_ = trimWhitespace(tokenDetails_[6])

			fluidMint   = MustPublicKeyFromBase58(fluidMint_)
			obligation  = MustPublicKeyFromBase58(obligation_)
			reserve     = MustPublicKeyFromBase58(reserve_)
			pyth        = MustPublicKeyFromBase58(pyth_)
			switchboard = MustPublicKeyFromBase58(switchboard_)
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

		tokenDetail := TokenDetailsSolana{
			FluidMintPubkey:   fluidMint,
			TokenName:         tokenName,
			ObligationPubkey:  obligation,
			ReservePubkey:     reserve,
			PythPubkey:        pyth,
			SwitchboardPubkey: switchboard,
			TokenDecimals:     decimalsRat,
		}

		tokenDetails[i] = tokenDetail
	}

	return tokenDetails
}
