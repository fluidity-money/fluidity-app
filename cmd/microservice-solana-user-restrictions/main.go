// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/solana"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func main() {
	user_actions.BufferedUserActionsSolana(func(bufferedUserAction user_actions.BufferedUserAction) {
		userActions := bufferedUserAction.UserActions

		for _, userAction := range userActions {
			var (
				network_        = userAction.Network
				transactionHash = userAction.TransactionHash
				swapIn          = userAction.SwapIn
				senderAddress   = userAction.SenderAddress
				amount          = userAction.Amount
				tokenDetails    = userAction.TokenDetails
			)

			if network_ != network.NetworkSolana {
				log.Debugf(
					"Network for transaction hash %#v was not Solana! Was %#v!",
					transactionHash,
					network_,
				)

				continue
			}

			var (
				tokenName     = tokenDetails.TokenShortName
				tokenDecimals = tokenDetails.TokenDecimals
			)

			log.Debug(func(k *log.Log) {
				k.Format(
					"Transaction hash %v, token name %v, unnormalised amount %v swapped in: %v",
					transactionHash,
					tokenName,
					amount,
					swapIn,
				)
			})

			// the user swapped in, so we increase the user's minted amount

			normalised := new(big.Rat).SetInt(&amount.Int)

			tokenDecimalsAdjusted := math.Pow10(tokenDecimals)

			tokenDecimalsExp := new(big.Rat).SetFloat64(tokenDecimalsAdjusted)

			normalised.Quo(normalised, tokenDecimalsExp)

			normalisedFloat, _ := normalised.Float64()

			log.Debug(func(k *log.Log) {
				k.Format(
					"Transaction hash %v, token name %v, decimals %v, normalised to %v",
					transactionHash,
					tokenName,
					tokenDecimals,
					normalisedFloat,
				)
			})

			if swapIn {
				solana.AddMintUserLimit(senderAddress, normalisedFloat)
			} else {
				solana.ReduceMintUserLimit(senderAddress, normalisedFloat)
			}
		}
	})
}
