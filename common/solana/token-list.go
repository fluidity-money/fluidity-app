// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

import (
	"math"
	"math/big"
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"

	"github.com/gagliardetto/solana-go"
)

// TokenDetailsSolana containing information about tokens that we unpacked using
// the environment variables
type TokenDetailsSolana struct {
	FluidMintPubkey   solana.PublicKey
	ObligationPubkey  solana.PublicKey
	ReservePubkey     solana.PublicKey
	PythPubkey        solana.PublicKey
	SwitchboardPubkey solana.PublicKey
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
		)

		fluidMint, err := solana.PublicKeyFromBase58(fluidMint_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to decode fluid mint from base58 %#v",
					fluidMint_,
				)

				k.Payload = err
			})
		}

		obligation, err := solana.PublicKeyFromBase58(obligation_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to decode obligation from base58 %#v",
					obligation_,
				)

				k.Payload = err
			})
		}

		reserve, err := solana.PublicKeyFromBase58(reserve_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to decode reserve from base58 %#v",
					reserve_,
				)

				k.Payload = err
			})
		}

		pyth, err := solana.PublicKeyFromBase58(pyth_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to decode pyth from base58 %#v",
					pyth_,
				)

				k.Payload = err
			})
		}

		switchboard, err := solana.PublicKeyFromBase58(switchboard_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to decode switchboard from base58 %#v",
					switchboard_,
				)

				k.Payload = err
			})
		}

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
