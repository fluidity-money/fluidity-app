// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/solana"
	user_actions "github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/log"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	userActionsType "github.com/fluidity-money/fluidity-app/lib/types/user-actions"
)

func handleUserAction(userAction user_actions.UserAction) {
		var (
			network         = userAction.Network
			transactionHash = userAction.TransactionHash
			application     = userAction.Application
		)

		existingUserTransaction := user_actions.GetAggregatedUserTransactionByHash(network, transactionHash)

		// insert if this transaction is unseen
		if existingUserTransaction == nil {
			userTransaction := userActionsType.AggregatedTransactionFromUserAction(userAction)
			user_actions.InsertAggregatedUserTransaction(userTransaction)
			// corresponding pending win has already been seen, so set user action specific fields
		} else if existingUserTransaction.RecipientAddress == "" {
			// use aggregate function to scale amount to dollars and convert solana addresses
			userTransaction := userActionsType.AggregatedTransactionFromUserAction(userAction)

			existingUserTransaction.Time = userAction.Time
			existingUserTransaction.RecipientAddress = userAction.RecipientAddress
			existingUserTransaction.Amount = userTransaction.Amount
			existingUserTransaction.Type = userAction.Type
			existingUserTransaction.SwapIn = userAction.SwapIn

			user_actions.UpdateAggregatedUserTransactionByHash(*existingUserTransaction, transactionHash)

			// prefer to show an application if any logs in this transaction contain one
		} else if existingUserTransaction.Application == "none" && application != "none" {
			existingUserTransaction.Application = application
			user_actions.UpdateAggregatedUserTransactionByHash(*existingUserTransaction, transactionHash)
		}
	}

func main() {
	go queue.UserActionsEthereum(handleUserAction)

	// Solana user actions are sent over the buffered queue
	go queue.BufferedUserActionsSolana(func(buffered queue.BufferedUserAction) {
		for _, userAction := range buffered.UserActions {
			handleUserAction(userAction)
		}
	})

	go winners.WinnersAll(func(winner winners.Winner) {
		var (
			network_             = winner.Network
			transactionHash     = winner.TransactionHash
			application         = winner.Application
			tokenDecimals       = winner.TokenDetails.TokenDecimals
			winningAmountInt    = winner.WinningAmount.Int
			utility             = winner.Utility

			winnerAddress       string
		)

		// replace ATAs with their owners
		if winner.Network == network.NetworkSolana {
			winnerAddress = winner.SolanaWinnerOwnerAddress
			winningSignature := solana.GetIntermediateWinner(transactionHash)
			winner.SendTransactionHash = winningSignature
		} else {
			winnerAddress = winner.WinnerAddress
		}

		sendTransactionHash := winner.SendTransactionHash

		existingUserTransaction := user_actions.GetAggregatedUserTransactionByHash(network_, sendTransactionHash)
		if existingUserTransaction == nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Found a winner in transaction %v with no corresponding send!",
					sendTransactionHash,
				)
			})
		}

		decimalsAdjusted := math.Pow10(tokenDecimals)
		decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)
		winningAmount := new(big.Rat).SetInt(&winningAmountInt)
		winningAmountFloat, _ := winningAmount.Quo(winningAmount, decimalsRat).Float64()

		existingUtility := existingUserTransaction.UtilityName

		switch {
		// Solana doesn't have utilities, so utility could be empty
		case utility == "":
			fallthrough
		// a regular win
		case utility == "FLUID":
			// regardless of whether there's existing win data, always prefer to show
			// an application if any logs in this transaction contain one
			if existingUserTransaction.Application == "none" {
				existingUserTransaction.Application = application
			}
			// use the largest win amount in this transaction as summation may double count pending wins
			if existingUserTransaction.WinningAmount < winningAmountFloat {
				existingUserTransaction.WinningAmount = winningAmountFloat
			}
			// no existing info, update all win-related fields
			if existingUserTransaction.WinningAddress == "" {
				existingUserTransaction.WinningAddress = winnerAddress
				existingUserTransaction.UtilityName = utility
			}

		// a utility payout
		// update utility amount and name if unset or the existing utility is smaller
		case existingUtility == "FLUID" :
			fallthrough
		case existingUtility == "":
			fallthrough
		case existingUserTransaction.UtilityAmount < winningAmountFloat:
			existingUserTransaction.UtilityName = utility
			existingUserTransaction.UtilityAmount = winningAmountFloat
		}

		// a pending winner might have set other win info
		// but it cannot set the reward hash
		if existingUserTransaction.RewardHash == "" {
			existingUserTransaction.RewardHash = transactionHash
		}

		user_actions.UpdateAggregatedUserTransactionByHash(*existingUserTransaction, sendTransactionHash)
	})

	winners.PendingWinners(func(pendingWinners []winners.PendingWinner) {
		for _, pendingWinner := range pendingWinners {
			var (
				network         = pendingWinner.Network
				transactionHash = pendingWinner.TransactionHash
				application     = pendingWinner.Application
				usdWinAmount    = pendingWinner.UsdWinAmount
				senderAddress   = pendingWinner.SenderAddress
				utility         = pendingWinner.Utility
			)

			existingUserTransaction := user_actions.GetAggregatedUserTransactionByHash(network, transactionHash)

			// corresponding user action has not yet been tracked, so create the row
			if existingUserTransaction == nil {
				userTransaction := userActionsType.AggregatedTransactionFromPendingWinner(pendingWinner)
				user_actions.InsertAggregatedUserTransaction(userTransaction)
				return
			}

			var (
				winningAmountFloat = usdWinAmount
				existingUtility    = existingUserTransaction.UtilityName
			)

			switch {
			// a regular win
			case utility == "FLUID":
				// regardless of whether there's existing win data, always prefer to show
				// an application if any logs in this transaction contain one
				if existingUserTransaction.Application == "none" {
					existingUserTransaction.Application = application
				}
				// use the largest win amount in this transaction as summation may double count pending wins
				if existingUserTransaction.WinningAmount < winningAmountFloat {
					existingUserTransaction.WinningAmount = winningAmountFloat
				}
				// no existing info, update all win-related fields
				if existingUserTransaction.WinningAddress == "" {
					existingUserTransaction.WinningAddress = senderAddress
					existingUserTransaction.WinningAmount = winningAmountFloat
					existingUserTransaction.UtilityName = utility
				}
			// a utility payout
			// update utility amount and name if unset or the existing utility is smaller
			case existingUtility == "FLUID" :
				fallthrough
			case existingUtility == "":
				fallthrough
			case existingUserTransaction.UtilityAmount < winningAmountFloat:
				existingUserTransaction.UtilityName = utility
				existingUserTransaction.UtilityAmount = winningAmountFloat
			}

			user_actions.UpdateAggregatedUserTransactionByHash(*existingUserTransaction, transactionHash)
		}
	})
}
