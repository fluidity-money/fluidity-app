// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package winners

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/token-details"
)

// whether a win is for the sender or recipient
// "send" || "receive"
type RewardType string

// represents an enum containing applications for a network
type Application interface {
	String() string
}

type Winner struct {
	Network                  network.BlockchainNetwork `json:"network"`
	TransactionHash          string                    `json:"transaction_hash"`
	SendTransactionHash      string                    `json:"send_transaction_hash"`
	WinnerAddress            string                    `json:"winner_address"`
	SolanaWinnerOwnerAddress string                    `json:"solana_winner_owner_address"`
	WinningAmount            misc.BigInt               `json:"winning_amount"`
	AwardedTime              time.Time                 `json:"awarded_time"`
	RewardType				 RewardType                `json:"reward_type"`
	// this is the stringified result of either an ethereum.Application or solana.Application
	Application              string                    `json:"application"`
	Utility                  applications.UtilityName  `json:"utility"`
	BatchFirstBlock          misc.BigInt               `json:"first_block"`
	BatchLastBlock           misc.BigInt               `json:"last_block"`

	TokenDetails token_details.TokenDetails `json:"token_details"`
}

type BlockedWinner struct {
	Network                 network.BlockchainNetwork  `json:"network"`
	Token                   token_details.TokenDetails `json:"token"`
	EthereumContractAddress string                     `json:"contract_address"`
	RewardTransactionHash   string                     `json:"reward_transaction_hash"`
	WinnerAddress           string                     `json:"winner_address"`
	WinningAmount           misc.BigInt                `json:"winning_amount"`
	BatchFirstBlock         misc.BigInt                `json:"first_block"`
	BatchLastBlock          misc.BigInt                `json:"last_block"`
}
