package main

import (
	"math"
	"math/big"
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/gagliardetto/solana-go"
)

// TokenDetails containing information about tokens that we unpacked using
// the environment variables
type TokenDetails struct {
	fluidMintPubkey   solana.PublicKey 
	obligationPubkey  solana.PublicKey 
	reservePubkey     solana.PublicKey 
	pythPubkey        solana.PublicKey 
	switchboardPubkey solana.PublicKey
	tokenDecimals     *big.Rat
	amount            float64
}

func trimWhitespace(s string) string {
	return strings.Trim(s, " \n\t")
}

func getTokensList(tokensList_ string) []TokenDetails {

	tokensList := strings.Split(tokensList_, ",")

	tokenDetails := make([]TokenDetails, len(tokensList))

	for i, tokenInfo_ := range tokensList {

		tokenDetails_ := strings.Split(tokenInfo_, ":")

		if len(tokenDetails_) != 7 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Token information split not structured properly! %#v",
					tokenInfo_,
				)
			})
		}

		var (
			fluidMint_   = trimWhitespace(tokenDetails_[0])
			//tokenDetails_[1] = tokenName
			decimals_    = trimWhitespace(tokenDetails_[2])
			obligation_  = trimWhitespace(tokenDetails_[3])
			reserve_     = trimWhitespace(tokenDetails_[4])
			pyth_        = trimWhitespace(tokenDetails_[5])
			switchboard_ = trimWhitespace(tokenDetails_[6])
		)

		fluidMint   := solana.MustPublicKeyFromBase58(fluidMint_)
		obligation  := solana.MustPublicKeyFromBase58(obligation_)
		reserve     := solana.MustPublicKeyFromBase58(reserve_)
		pyth        := solana.MustPublicKeyFromBase58(pyth_)
		switchboard := solana.MustPublicKeyFromBase58(switchboard_)

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
			fluidMintPubkey:   fluidMint, 
			obligationPubkey:  obligation,
			reservePubkey:     reserve,	
			pythPubkey:        pyth,    			
			switchboardPubkey: switchboard,			
			tokenDecimals:     decimalsRat,
		}

		tokenDetails[i] = tokenDetail
	}

	return tokenDetails

}
