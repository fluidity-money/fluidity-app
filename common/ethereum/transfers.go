package ethereum

import (
	"fmt"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

var transferLogTopic = strings.ToLower(
	"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
)

type Transfer struct {
	FromAddress ethereum.Address
	ToAddress   ethereum.Address
	Transaction ethereum.Transaction
}

// Get transfer receipts
func GetTransfers(logs []ethereum.Log, transactions []ethereum.Transaction, blockHash ethereum.Hash, fluidContractAddress ethereum.Address) ([]Transfer, error) {
	blockTransactions := make(map[ethereum.Hash]ethereum.Transaction)

	for _, transaction := range transactions {
		blockTransactions[transaction.Hash] = transaction
	}

	transfers := make([]Transfer, 0)
	failedTransactions := make([]ethereum.Hash, 0)

	for _, log := range logs {
		transactionHash := log.TxHash

		var (
			transferContractAddress_ = log.Address.String()
			topics                   = log.Topics
		)

		transferContractAddress := strings.ToLower(transferContractAddress_)

		if transferContractAddress != string(fluidContractAddress) {
			Debug(
				"For transaction hash %#v, contract was %#v, not %#v!",
				transactionHash,
				transferContractAddress,
				fluidContractAddress,
			)

			continue
		}

		firstTopic := strings.ToLower(topics[0].String())

		if !IsTransferLogTopic(firstTopic) {
			Debug(
				"For transaction hash %#v, first topic %#v != transfer log topic %#v!",
				transactionHash,
				firstTopic,
				transferLogTopic,
			)

			continue
		}

		if len(topics) != 3 {
			Debug(
				"Number of topics for transaction hash %#v, topic content %#v length != 3!",
				transactionHash,
				topics,
			)

			continue
		}

		// Remove padding 0x from addresses
		var (
			fromAddress_ = topics[1].String()[26:]
			toAddress_   = topics[2].String()[26:]
		)

		fromAddress := ethereum.AddressFromString(fromAddress_)

		toAddress := ethereum.AddressFromString(toAddress_)

		logTransaction, found := blockTransactions[log.TxHash]

		if !found {
			failedTransactions = append(failedTransactions, log.TxHash)
		}

		transfer := Transfer{
			FromAddress: fromAddress,
			ToAddress:   toAddress,
			Transaction: logTransaction,
		}

		transfers = append(transfers, transfer)
	}

	err := error(nil)

	if len(failedTransactions) > 0 {
		err = fmt.Errorf(
			"Block %v had %v unreferenced txs: %v",
			blockHash,
			len(failedTransactions),
			failedTransactions,
		)
	}

	return transfers, err
}

// GetTransferRecipient of the transfer function, returning nil if the
// null address was being sent to
func GetTransferRecipient(transaction ethereum.Transaction) (ethereum.Address, error) {
	return ethereum.AddressFromString("0x0000000000000000000000000000000000000000"), nil
}

func IsTransferLogTopic(topic string) bool {
	return topic == transferLogTopic
}
