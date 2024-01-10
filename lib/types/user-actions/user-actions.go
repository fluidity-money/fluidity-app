// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package user_actions

import (
	"math"
	"math/big"
	"time"

	solApplications "github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
)

const (
	// UserActionSwap, with the swap of a token into (or out of) a Fluid Asset
	UserActionSwap = `swap`

	// UserActionSend to another user from this user
	UserActionSend = `send`
)

type (
	UserAction struct {
		// EventNumber of this UserAction. May be useful to get more information
		// about an event. Set by the database!
		EventNumber uint64 `json:"event_number"`

		// Network that this event took place on
		Network network.BlockchainNetwork `json:"network"`

		// Type of the user action, currently either a swap or a send
		Type string `json:"type"`

		// TransactionHash to find the transaction that generated this user action
		TransactionHash string `json:"transaction_hash"`

		// LogIndex for the index of the log in the block
		LogIndex misc.BigInt `json:"log_index"`

		// SwapIn or swap out from a Fluid Asset. If true, then that would indicate
		// that the transfer went from USDT to fUSDT for example.
		SwapIn bool `json:"swap_in"`

		// Creator of the user action (their address)
		SenderAddress string `json:"sender_address"`

		// Account that owns the sender ATA for solana, empty string otherwise
		SolanaSenderOwnerAddress string `json:"solana_sender_owner_address"`

		// Recipient of the user action, if the user action was a send
		RecipientAddress string `json:"recipient_address"`

		// Account that owns the receiver ATA for solana, empty string otherwise
		SolanaRecipientOwnerAddress string `json:"solana_recipient_owner_address"`

		// Fee adjusted based on compute units used
		AdjustedFee *big.Rat

		// Amount that was swapped or sent
		Amount misc.BigInt `json:"amount"`

		// AmountStr is the string representation of Amount
		// Used to accurately store digits in database
		AmountStr string `json:"amount_str"`

		// TokenDetails to include information on the token's name and the number
		// of decimal places contained within it
		TokenDetails token_details.TokenDetails `json:"token_details"`

		// Time of this user action
		Time time.Time `json:"time"`

		// this is the stringified result of either an ethereum.Application or solana.Application
		Application string `json:"application"`
	}

	BufferedUserAction struct {
		UserActions          []UserAction `json:"user_actions"`
		SecondsSinceLastSlot uint64       `json:"seconds_since_last_slot"`
	}

	// unique on tx hash, aggregates all log indexes
	// stored literally as it should be returned, so amount is rounded etc
	AggregatedUserTransaction struct {
		TokenShortName string `json:"token_short_name"`

		Network network.BlockchainNetwork `json:"network"`

		Time time.Time `json:"time"`

		TransactionHash string `json:"transaction_hash"`

		// SenderAddress is the owner of the ATA that sent this transaction on Solana
		// and the normal sender address on other networks
		SenderAddress string `json:"sender_address"`

		// RecipientAddress is the owner of the ATA that received this transaction on Solana
		// and the normal sender address on other networks
		RecipientAddress string `json:"recipient_address"`

		// scaled to usd
		Amount float64 `json:"amount"`

		Application string `json:"application"`

		WinningAddress string `json:"winning_address"`

		WinningAmount float64 `json:"winning_amount"`

		RewardHash string `json:"reward_hash"`

		// Type of the user action, currently either a swap or a send
		Type string `json:"type"`

		// SwapIn or swap out from a Fluid Asset. If true, then that would indicate
		// that the transfer went from USDT to fUSDT for example.
		SwapIn bool `json:"swap_in"`

		// scaled to usd
		UtilityAmount float64 `json:"utility_amount"`

		UtilityName applications.UtilityName `json:"utility_name"`
	}
)

// AggregatedTransactionFromUserAction to create a partially aggregated transaction from a user action
func AggregatedTransactionFromUserAction(userAction UserAction) AggregatedUserTransaction {
	var (
		senderAddress    string
		recipientAddress string
	)

	// replace ATAs with their owners
	if userAction.Network == network.NetworkSolana {
		senderAddress = userAction.SolanaSenderOwnerAddress
		recipientAddress = userAction.SolanaRecipientOwnerAddress
	} else {
		senderAddress = userAction.SenderAddress
		recipientAddress = userAction.RecipientAddress
	}

	// convert amount to a dollar float
	decimalsAdjusted := math.Pow10(userAction.TokenDetails.TokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)
	amount := new(big.Rat).SetInt(&userAction.Amount.Int)
	amountFloat, _ := amount.Quo(amount, decimalsRat).Float64()

	return AggregatedUserTransaction{
		TokenShortName:   userAction.TokenDetails.TokenShortName,
		Network:          userAction.Network,
		Time:             userAction.Time,
		Amount:           amountFloat,
		Application:      userAction.Application,
		Type:             userAction.Type,
		SwapIn:           userAction.SwapIn,
		TransactionHash:  userAction.TransactionHash,
		SenderAddress:    senderAddress,
		RecipientAddress: recipientAddress,
	}
}

// AggregatedTransactionFromPendingWinner to create a partially aggregated transaction from a pending winner
func AggregatedTransactionFromPendingWinner(pendingWinner winners.PendingWinner) AggregatedUserTransaction {
	var (
		application   = pendingWinner.Application.String()
		senderAddress = pendingWinner.SenderAddress.String()
	)

	userTransaction := AggregatedUserTransaction{
		TokenShortName:  pendingWinner.TokenDetails.TokenShortName,
		Network:         pendingWinner.Network,
		TransactionHash: pendingWinner.TransactionHash.String(),
		SenderAddress:   senderAddress,
		// the sender is the winner of a pending win
		WinningAddress: senderAddress,
		Type:           "send",
	}

	if pendingWinner.Utility == "FLUID" {
		userTransaction.Application = application
		userTransaction.WinningAmount = pendingWinner.UsdWinAmount
	} else {
		userTransaction.UtilityName = applications.UtilityName(application)
		userTransaction.UtilityAmount = pendingWinner.UsdWinAmount
		if pendingWinner.Network == network.NetworkSolana {
			userTransaction.Application = "spl"
		} else {
			userTransaction.Application = "none"
		}
	}

	return userTransaction
}

// NewSwapEthereum made by the user, either swapping in (swapIn) to a
// Fluid Asset from an underlying asset or swapping out. Sets the time to
// time.Now().
func NewSwapEthereum(network_ network.BlockchainNetwork, senderAddress ethereum.Address, transactionHash ethereum.Hash, amount misc.BigInt, swapIn bool, tokenShortName string, tokenDecimals int) UserAction {
	return UserAction{
		Network:         network_,
		TransactionHash: transactionHash.String(),
		Type:            UserActionSwap,
		SwapIn:          swapIn,
		SenderAddress:   senderAddress.String(),
		Amount:          amount,
		AmountStr:       amount.String(),
		TokenDetails:    token_details.New(tokenShortName, tokenDecimals),
		Time:            time.Now(),
		Application:     "none",
	}
}

// NewSwapSolana made by the user, either swapping in (swapIn) to a Fluid
// Asset from an underlying asset or swapping out. Sets the time to
// time.Now(). Solana ATA owner addresses should be set outside of the
// function.
func NewSwapSolana(senderAddress, transactionHash string, amount misc.BigInt, swapIn bool, tokenShortName string, tokenDecimals int) UserAction {
	return UserAction{
		Network:         network.NetworkSolana,
		TransactionHash: transactionHash,
		Type:            UserActionSwap,
		SwapIn:          swapIn,
		SenderAddress:   senderAddress,
		Amount:          amount,
		AmountStr:       amount.String(),
		TokenDetails:    token_details.New(tokenShortName, tokenDecimals),
		Time:            time.Now(),
		Application:     "spl",
	}
}

// NewSendEthereum of a Fluid Asset, from the sender to the recipient
// with the transaction hash with the amount. The current time is set
// within the function.
func NewSendEthereum(network_ network.BlockchainNetwork, senderAddress, recipientAddress ethereum.Address, transactionHash ethereum.Hash, amount misc.BigInt, tokenShortName string, tokenDecimals int, logIndex misc.BigInt, application applications.Application) UserAction {
	return UserAction{
		Network:          network_,
		TransactionHash:  transactionHash.String(),
		LogIndex:         logIndex,
		Type:             UserActionSend,
		SenderAddress:    senderAddress.String(),
		RecipientAddress: recipientAddress.String(),
		Amount:           amount,
		AmountStr:        amount.String(),
		TokenDetails:     token_details.New(tokenShortName, tokenDecimals),
		Time:             time.Now(),
		Application:      application.String(),
	}
}

func NewSendSolana(senderAddress, recipientAddress, transactionHash string, amount misc.BigInt, tokenShortName string, tokenDecimals int, applications []solApplications.Application) UserAction {
	solanaApplication := "spl"

	if len(applications) > 0 {
		solanaApplication = applications[0].String()
	}

	return UserAction{
		Network:          network.NetworkSolana,
		TransactionHash:  transactionHash,
		Type:             UserActionSend,
		SenderAddress:    senderAddress,
		RecipientAddress: recipientAddress,
		Amount:           amount,
		AmountStr:        amount.String(),
		TokenDetails:     token_details.New(tokenShortName, tokenDecimals),
		Time:             time.Now(),
		Application:      solanaApplication,
	}
}

// IsSwap type of user action (was this a swap?)
func (userAction UserAction) IsSwap() bool {
	return userAction.Type == UserActionSwap
}

// IsSend type of user action (was this a send?)
func (userAction UserAction) IsSend() bool {
	return userAction.Type == UserActionSend
}
