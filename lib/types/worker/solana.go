// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package worker

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/solana"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	user_actions "github.com/fluidity-money/fluidity-app/lib/types/user-actions"
)

type (
	// SolanaApplicationTransaction is a solana transaction that is relevant
	// to fluidity with some added metadata
	SolanaApplicationTransaction struct {
		Signature   string                   `json:"signature"`
		Result      solana.TransactionResult `json:"result"`
		AdjustedFee *big.Rat                 `json:"adjusted_fee"`
		Application applications.Application `json:"application"`
	}

	SolanaBufferedApplicationTransactions struct {
		Transactions []SolanaApplicationTransaction `json:"transactions"`
		Slot         uint64                         `json:"slot"`
	}

	// SolanaParsedTransaction is a solana transaction with spl user actions
	SolanaParsedTransaction struct {
		Transaction SolanaApplicationTransaction `json:"transaction"`
		Transfers   []user_actions.UserAction    `json:"transfers"`
	}

	// SolanaBufferedParsedTransactions is several SolanaParsedTransaction
	// objects, buffered by slot
	SolanaBufferedParsedTransactions struct {
		Transactions []SolanaParsedTransaction `json:"transactions"`
		Slot         uint64                    `json:"slot"`
	}

	// SolanaWorkerDecorator contains an adjusted application fee
	// (able to be expanded with more specific app details)
	SolanaWorkerDecorator struct {
		ApplicationFee *big.Rat `json:"application_fee"`
	}

	// SolanaDecoratedTransfer contains a solana transfer, and optionally,
	// an adjusted app fee
	SolanaDecoratedTransfer struct {
		// Transaction containing the event
		Transaction SolanaApplicationTransaction `json:"transaction"`

		Token token_details.TokenDetails `json:"token_details"`

		// SPL accounts of the parties involved in the swap,
		// where sender recieves the majority of a potential reward,
		// and one party could be a smart contract
		SenderSplAddress    string `json:"sender_spl_address"`
		RecipientSplAddress string `json:"recipient_spl_address"`

		// addresses of the accounts that own the SPL accounts
		SenderOwnerAddress    string `json:"sender_owner_address"`
		RecipientOwnerAddress string `json:"recipient_owner_address"`

		Decorator *SolanaWorkerDecorator `json:"decorator"`
	}

	// SolanaBufferedTransfers buffers decorated transfers by slot
	SolanaBufferedTransfers struct {
		Transfers            []SolanaDecoratedTransfer `json:"transfers"`
		SecondsSinceLastSlot uint64                    `json:"seconds_since_last_slot"`
	}

	// SolanaWork augments SolanaBufferedTransfers with tvl and mint details
	SolanaWork struct {
		BufferedTransfers SolanaBufferedTransfers `json:"buffered_transfers"`
		Tvl               uint64                  `json:"tvl"`
		MintSupply        uint64                  `json:"mint_supply"`
	}

	// SolanaWinnerAnnouncement to use to report a winner and its randomness
	SolanaWinnerAnnouncement struct {
		WinningTransactionHash string   `json:"transaction_winning"`
		SenderAddress          string   `json:"sender_address"`
		RecipientAddress       string   `json:"receiver_address"`
		WinningAmount          uint64   `json:"winning_amount"`
		TokenName              string   `json:"token_name"`
		FluidMintPubkey        string   `json:"fluid_mint_pubkey"`
		Emissions              Emission `json:"emissions"`
	}
)

func NewSolanaEmission() *Emission {
	emission := new(Emission)
	emission.Network = "solana"
	return emission
}
