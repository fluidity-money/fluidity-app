// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
)

type (
	// EthereumAnnouncement contains the data to call the reward function of
	// the contract with
	EthereumAnnouncement struct {
		TransactionHash ethereum.Hash                         `json:"transaction_hash"`
		BlockNumber     *misc.BigInt                          `json:"block_number"`
		FromAddress     ethereum.Address                      `json:"from_address"`
		ToAddress       ethereum.Address                      `json:"to_address"`
		RandomSource    []uint32                              `json:"random_source"`
		RandomPayouts   map[applications.UtilityName][]Payout `json:"random_payouts"`
		TokenDetails    token_details.TokenDetails            `json:"token_details"`
		Emissions       Emission                              `json:"emissions"`
		Application     applications.Application              `json:"application"`
	}

	EthereumWinnerAnnouncement struct {
		Network         network.BlockchainNetwork           `json:"network"`
		TransactionHash ethereum.Hash                       `json:"transaction_hash"`
		BlockNumber     *misc.BigInt                        `json:"block_number"`
		FromAddress     ethereum.Address                    `json:"from_address"`
		ToAddress       ethereum.Address                    `json:"to_address"`
		FromWinAmount   map[applications.UtilityName]Payout `json:"from_win_amount"`
		ToWinAmount     map[applications.UtilityName]Payout `json:"to_win_amount"`
		TokenDetails    token_details.TokenDetails          `json:"token_details"`
		Application     applications.Application            `json:"application"`
	}

	EthereumReward struct {
		Winner          ethereum.Address           `json:"winner"`
		WinAmount       *misc.BigInt               `json:"amount"`
		Utilityname     applications.UtilityName   `json:"utility"`
		TransactionHash ethereum.Hash              `json:"transaction_hash"`
		BlockNumber     *misc.BigInt               `json:"block_number"`
		TokenDetails    token_details.TokenDetails `json:"token_details"`
		Network         network.BlockchainNetwork  `json:"network"`
	}

	EthereumSpooledRewards struct {
		Network    network.BlockchainNetwork                                     `json:"network"`
		Token      token_details.TokenDetails                                    `json:"token_details"`
		FirstBlock *misc.BigInt                                                  `json:"first_block"`
		LastBlock  *misc.BigInt                                                  `json:"last_block"`
		Rewards    map[applications.UtilityName]map[ethereum.Address]misc.BigInt `json:"rewards"`
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
		// Enum corresponding to the application
		Application applications.Application `json:"application"`
		// optional utility corresponding to the application
		UtilityName applications.UtilityName `json:"utility_name"`
		// Application fee in USD
		ApplicationFee *big.Rat `json:"application_fee"`
	}

	// EthereumDecoratedTransaction is a transaction, its receipt, and any
	// associated transfers
	EthereumDecoratedTransaction struct {
		Transaction ethereum.Transaction `json:"transaction"`
		Receipt ethereum.Receipt `json:"receipt"`
		Transfers []EthereumDecoratedTransfer `json:"transfers"`
	}
	// Transfer with application information attached
	EthereumDecoratedTransfer struct {
		TransactionHash ethereum.Hash `json:"transaction_hash"`

		// Parties involved in the swap, where sender recieves the majority
		// of a potential reward, and one party could be a smart contract
		SenderAddress ethereum.Address `json:"sender_address"`

		RecipientAddress ethereum.Address `json:"recipient_address"`

		Decorator *EthereumWorkerDecorator `json:"decorator"`

		AppEmissions EthereumAppFees `json:"app_emissions"`
	}

	// Hinted block sent from the application server
	EthereumHintedBlock struct {
		BlockHash             ethereum.Hash                                  `json:"block_hash"`
		BlockBaseFee          misc.BigInt                                    `json:"block_base_fee"`
		BlockTime             uint64                                         `json:"block_time"`
		BlockNumber           misc.BigInt                                    `json:"block_number"`
		DecoratedTransactions map[ethereum.Hash]EthereumDecoratedTransaction `json:"decorated_transfers"`
	}

	// An event the worker server sends for processing when it finds a log of interest
	EthereumApplicationEvent struct {
		ApplicationTransfers []EthereumApplicationTransfer `json:"application_transfers"`
		BlockLog             EthereumBlockLog              `json:"block_log"`
	}

	// An individual log included in an application event
	EthereumApplicationTransfer struct {
		TransactionHash ethereum.Hash `json:"transaction"`
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
