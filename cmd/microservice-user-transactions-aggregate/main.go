// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math"
	"math/big"

	user_actions "github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/log"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	userActionsType "github.com/fluidity-money/fluidity-app/lib/types/user-actions"
	winnerTypes "github.com/fluidity-money/fluidity-app/lib/types/winners"
)

func main() {
    go queue.UserActionsAll(func(userAction user_actions.UserAction) {
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
        // prefer to show an application if any logs in this transaction contain one
        } else if existingUserTransaction.Application == "none" && application != "none" { 
            existingUserTransaction.Application = application 
            user_actions.UpdateAggregatedUserTransactionByHash(*existingUserTransaction, transactionHash)
        }
    }) 

    go winners.WinnersAll(func(winner winners.Winner) {
        var (
            network             = winner.Network
            transactionHash     = winner.TransactionHash
            application         = winner.Application
            sendTransactionHash = winner.SendTransactionHash
            tokenDecimals       = winner.TokenDetails.TokenDecimals
            winningAmountInt    = winner.WinningAmount.Int
            winnerAddress       = winner.WinnerAddress
            utility             = winner.Utility
        )

        existingUserTransaction := user_actions.GetAggregatedUserTransactionByHash(network, sendTransactionHash) 
        if existingUserTransaction == nil {
            log.Fatal(func(k *log.Log) {
                k.Format(
                    "Found a winner in transaction %v with no corresponding send!",
                    sendTransactionHash,
                )
            })
        }

        // regardless of whether there's existing win data, always prefer to show
        // an application if any logs in this transaction contain one
        if existingUserTransaction.Application == "none" {
            existingUserTransaction.Application = application 
        }

        decimalsAdjusted := math.Pow10(tokenDecimals)
        decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)
        winningAmount := new(big.Rat).SetInt(&winningAmountInt)
        winningAmountFloat, _ := winningAmount.Quo(winningAmount, decimalsRat).Float64()


        // no existing info, update all win-related fields
        if existingUserTransaction.WinningAddress == "" && utility == "FLUID" {
            existingUserTransaction.WinningAddress = winnerAddress
            existingUserTransaction.WinningAmount = winningAmountFloat
            existingUserTransaction.RewardHash = transactionHash
            existingUserTransaction.UtilityName = utility
        }

        existingUtility := existingUserTransaction.UtilityName

        // update utility amount and name if unset
        if utility != "FLUID" && (existingUtility == "FLUID" || existingUtility == "") {
            existingUserTransaction.UtilityAmount = winningAmountFloat
            existingUserTransaction.UtilityName = utility
        }

        user_actions.UpdateAggregatedUserTransactionByHash(*existingUserTransaction, sendTransactionHash)
    })

    // pending winners have the same behaviour as winners
    winners.PendingWinners(func (pendingWinners []winnerTypes.PendingWinner) {
        for _, pendingWinner := range pendingWinners {
            var (
                network             = pendingWinner.Network
                transactionHash     = pendingWinner.TransactionHash.String()
                application         = pendingWinner.Application.String()
                usdWinAmount        = pendingWinner.UsdWinAmount
                senderAddress       = pendingWinner.SenderAddress.String()
                utility             = pendingWinner.Utility
            )

            existingUserTransaction := user_actions.GetAggregatedUserTransactionByHash(network, transactionHash) 
            if existingUserTransaction == nil {
                log.Fatal(func(k *log.Log) {
                    k.Format(
                        "Found a winner in transaction %v with no corresponding send!",
                        transactionHash,
                    )
                })
            }
            // regardless of whether there's existing win data, always prefer to show
            // an application if any logs in this transaction contain one
            if existingUserTransaction.Application == "none" {
                existingUserTransaction.Application = application
            }

            winningAmountFloat := usdWinAmount

            // no existing info, update all win-related fields
            if existingUserTransaction.WinningAddress == "" && utility == "FLUID" {
                existingUserTransaction.WinningAddress = senderAddress
                existingUserTransaction.WinningAmount = winningAmountFloat
                existingUserTransaction.RewardHash = transactionHash
                existingUserTransaction.UtilityName = utility
            }

            existingUtility := existingUserTransaction.UtilityName

            // update utility amount and name if unset
            if utility != "FLUID" && (existingUtility == "FLUID" || existingUtility == "") {
                existingUserTransaction.UtilityAmount = winningAmountFloat
                existingUserTransaction.UtilityName = utility
            }

            user_actions.UpdateAggregatedUserTransactionByHash(*existingUserTransaction, transactionHash)
        }
    })
}
