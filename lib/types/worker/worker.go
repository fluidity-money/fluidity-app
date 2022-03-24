package worker

import (
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

type (
	// Announcement contains the data to call the reward function
	// of the contract with
	EthereumAnnouncement struct {
		TransactionHash ethereum.Hash    `json:"transaction_hash"`
		FromAddress     ethereum.Address `json:"from_address"`
		ToAddress       ethereum.Address `json:"to_address"`
		SourceRandom    []uint32         `json:"random_source"`
		SourcePayouts   []*misc.BigInt   `json:"random_payouts"`
	}

	EthereumBlockLog struct {
		BlockHash    ethereum.Hash          `json:"block_hash"`
		BlockBaseFee misc.BigInt            `json:"block_base_fee"`
		BlockTime    uint64                 `json:"block_time"`
		Logs         []ethereum.Log         `json:"logs"`
		Transactions []ethereum.Transaction `json:"transactions"`
		BlockNumber  misc.BigInt            `json:"block_number"`
	}

	// SolanaWinnerAnnouncement to use to report a winner and its randomness
	SolanaWinnerAnnouncement struct {
		WinningTransactionHash string `json:"transaction_winning"`
		SenderAddress          string `json:"sender_address"`
		RecipientAddress       string `json:"receiver_address"`
		WinningAmount          uint64 `json:"winning_amount"`
	}
)
