// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
)

type (
	// EthereumAnnouncement contains the data to call the reward function of
	// the contract with
	EthereumAnnouncement struct {
		TransactionHash ethereum.Hash              `json:"transaction_hash"`
		BlockNumber     *misc.BigInt               `json:"block_number"`
		FromAddress     ethereum.Address           `json:"from_address"`
		ToAddress       ethereum.Address           `json:"to_address"`
		SourceRandom    []uint32                   `json:"random_source"`
		SourcePayouts   []*misc.BigInt             `json:"random_payouts"`
		TokenDetails    token_details.TokenDetails `json:"token_details"`
		Emissions       Emission                   `json:"emissions"`
	}

	EthereumWinnerAnnouncement struct {
		TransactionHash ethereum.Hash              `json:"transaction_hash"`
		BlockNumber     *misc.BigInt               `json:"block_number"`
		FromAddress     ethereum.Address           `json:"from_address"`
		ToAddress       ethereum.Address           `json:"to_address"`
		FromWinAmount   *misc.BigInt               `json:"from_win_amount"`
		ToWinAmount     *misc.BigInt               `json:"to_win_amount"`
		TokenDetails    token_details.TokenDetails `json:"token_details"`
	}

	EthereumReward struct {
		Winner          ethereum.Address           `json:"winner"`
		WinAmount       *misc.BigInt               `json:"amount"`
		TransactionHash ethereum.Hash              `json:"transaction_hash"`
		BlockNumber     *misc.BigInt               `json:"block_number"`
		TokenDetails    token_details.TokenDetails `json:"token_details"`
	}

	EthereumSpooledRewards struct {
		Token      token_details.TokenDetails `json:"token_details"`
		Winner     ethereum.Address           `json:"winner"`
		WinAmount  *misc.BigInt               `json:"amount"`
		FirstBlock *misc.BigInt               `json:"first_block"`
		LastBlock  *misc.BigInt               `json:"last_block"`
	}

	EthereumBlockLog struct {
		BlockHash    ethereum.Hash          `json:"block_hash"`
		BlockBaseFee misc.BigInt            `json:"block_base_fee"`
		BlockTime    uint64                 `json:"block_time"`
		BaseFee      misc.BigInt            `json:"base_fee"`
		Logs         []ethereum.Log         `json:"logs"`
		Transactions []ethereum.Transaction `json:"transactions"`
		BlockNumber  misc.BigInt            `json:"block_number"`
	}

	// Decorator attached to a transfer, able to be expanded to
	// include application data as needed
	EthereumWorkerDecorator struct {
		// Application fee in USD
		ApplicationFee *big.Rat `json:"application_fee"`
	}

	// Transfer with application information attached
	EthereumDecoratedTransfer struct {
		// Transaction containing the event
		Transaction ethereum.Transaction `json:"transaction"`

		// Parties involved in the swap, where sender recieves the majority
		// of a potential reward, and one party could be a smart contract
		SenderAddress ethereum.Address `json:"sender_address"`

		RecipientAddress ethereum.Address `json:"recipient_address"`

		// ReceiptGasPrice is set by the gasPrice field in the
		// receipt, which can differ
		ReceiptGasPrice uint64 `json:"gas_price"`

		// GasUsed by the transfer, should only be set by
		// microservice-ethereum-application-server after fetching
		// the receipt
		GasUsed uint64 `json:"gas_used"`

		// BaseFeePerGas returned by the block, set by
		// microservice-ethereum-application-server
		BaseFeePerGas misc.BigInt `json:"base_fee"`

		// MaxPriorityFeePerGas set by
		// microservice-ethereum-application-server
		MaxPriorityFeePerGas misc.BigInt `json:"max_priority_fee_per_gas"`

		// MaxFeePerGas set by
		// microservice-ethereum-application-server
		MaxFeePerGas misc.BigInt `json:"max_fee_per_gas"`

		Decorator *EthereumWorkerDecorator `json:"decorator"`

		AppEmissions EthereumAppFees `json:"app_emissions"`
	}

	// Hinted block sent from the application server
	EthereumHintedBlock struct {
		BlockHash          ethereum.Hash               `json:"block_hash"`
		BlockBaseFee       misc.BigInt                 `json:"block_base_fee"`
		BlockTime          uint64                      `json:"block_time"`
		BlockNumber        misc.BigInt                 `json:"block_number"`
		DecoratedTransfers []EthereumDecoratedTransfer `json:"decorated_transfers"`
	}

	// An event the worker server sends for processing when it finds a log of interest
	EthereumApplicationEvent struct {
		ApplicationTransfers []EthereumApplicationTransfer `json:"application_transfers"`
		BlockLog             EthereumBlockLog              `json:"block_log"`
	}

	// An individual log included in an application event
	EthereumApplicationTransfer struct {
		Transaction ethereum.Transaction `json:"transaction"`
		// the log classified as an application transfer
		// to be processed by the application server
		Log ethereum.Log `json:"log"`
		// an enum representing the application this
		// transfer is produced by
		Application applications.Application `json:"application"`
	}
)

func NewEthereumEmission() *Emission {
	emission := new(Emission)
	emission.Network = "ethereum"
	return emission
}
