// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
)

func convertBlockedPayout(winner *winners.Winner) winners.BlockedWinner {
	var (
		tokenDetails = winner.TokenDetails
		transactionHash = winner.TransactionHash
		winnerAddress = winner.WinnerAddress
		winningAmount = winner.WinningAmount
	)

	blockedWinner := winners.BlockedWinner{
		Network:                 network.NetworkSolana,
		Token:                   tokenDetails,
		RewardTransactionHash:   transactionHash,
		WinnerAddress:           winnerAddress,
		WinningAmount:           winningAmount,
	}

	return blockedWinner
}
