// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package user_actions

import (
	"math/big"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
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
	}

	BufferedUserAction struct {
		UserActions          []UserAction `json:"user_actions"`
		SecondsSinceLastSlot uint64       `json:"seconds_since_last_slot"`
	}
)

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
	}
}

// NewSendEthereum of a Fluid Asset, from the sender to the recipient
// with the transaction hash with the amount. The current time is set
// within the function.
func NewSendEthereum(network_ network.BlockchainNetwork, senderAddress, recipientAddress ethereum.Address, transactionHash ethereum.Hash, amount misc.BigInt, tokenShortName string, tokenDecimals int, logIndex misc.BigInt) UserAction {
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
	}
}

func NewSendSolana(senderAddress, recipientAddress, transactionHash string, amount misc.BigInt, tokenShortName string, tokenDecimals int) UserAction {
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
