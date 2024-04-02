package main

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	winnerTypes "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/sui"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	user_actions "github.com/fluidity-money/fluidity-app/lib/types/user-actions"
)

func userActionFromWrap(transactionHash string, wrap sui.WrapEvent, token sui.SuiToken) user_actions.UserAction {
	var (
		senderAddress  = wrap.UserAddress
		amount_        = wrap.FCoinAmount
		tokenShortName = token.TokenShortName
		tokenDecimals  = token.TokenDecimals
		amount         = misc.NewBigIntFromInt(*amount_)
	)

	return user_actions.NewSwapSui(network.NetworkSui, senderAddress, transactionHash, amount, true, tokenShortName, tokenDecimals)
}

func userActionFromUnwrap(transactionHash string, unwrap sui.UnwrapEvent, token sui.SuiToken) user_actions.UserAction {
	var (
		senderAddress  = unwrap.UserAddress
		amount_        = unwrap.FCoinAmount
		tokenShortName = token.TokenShortName
		tokenDecimals  = token.TokenDecimals
		amount         = misc.NewBigIntFromInt(*amount_)
	)

	return user_actions.NewSwapSui(network.NetworkSui, senderAddress, transactionHash, amount, false, tokenShortName, tokenDecimals)
}

// DistributeYieldEvent contains a single winner payout
func winnerFromDistributeYieldEvent(transactionHash string, event sui.DistributeYieldEvent, pendingWinner winnerTypes.PendingWinner, token sui.SuiToken) winners.Winner {
	var (
		sendTransactionHash = pendingWinner.TransactionHash
		rewardType          = pendingWinner.RewardType
		application         = pendingWinner.Application
		rewardTier          = pendingWinner.RewardTier
		checkpoint          = pendingWinner.BlockNumber
	)
	currentTime := time.Now()
	tokenDetails := token_details.New(token.TokenShortName, token.TokenDecimals)

	winningAmount := misc.BigIntFromUint64(event.AmountDistributed)

	winner := winners.Winner{
		Network:             network.NetworkSui,
		TransactionHash:     transactionHash,
		SendTransactionHash: sendTransactionHash,
		WinnerAddress:       event.Recipient,
		WinningAmount:       winningAmount,
		AwardedTime:         currentTime,
		RewardType:          rewardType,
		Application:         application,
		RewardTier:          rewardTier,
		BatchFirstBlock:     *checkpoint,
		BatchLastBlock:      *checkpoint,

		TokenDetails: tokenDetails,
	}

	return winner
}
