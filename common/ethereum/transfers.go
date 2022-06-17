package ethereum

import (
	"fmt"
	"strings"

	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

var TransferLogTopic = strings.ToLower(
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

	for _, transferLog := range logs {
		transactionHash := transferLog.TxHash

		var (
			transferContractAddress_ = transferLog.Address.String()
			topics                   = transferLog.Topics
		)

		transferContractAddress := strings.ToLower(transferContractAddress_)

		if transferContractAddress != string(fluidContractAddress) {
			log.Debugf(
				"For transaction hash %#v, contract was %#v, not %#v!",
				transactionHash,
				transferContractAddress,
				fluidContractAddress,
			)

			continue
		}

		firstTopic := strings.ToLower(topics[0].String())

		if !IsTransferLogTopic(firstTopic) {
			log.Debugf(
				"For transaction hash %#v, first topic %#v != transfer log topic %#v!",
				transactionHash,
				firstTopic,
				TransferLogTopic,
			)

			continue
		}

		if len(topics) != 3 {
			log.Debugf(
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

		logTransaction, found := blockTransactions[transferLog.TxHash]

		if !found {
			failedTransactions = append(failedTransactions, transferLog.TxHash)
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

// Get application receipts
func GetApplicationTransfers(logs []ethereum.Log, transactions []ethereum.Transaction, blockHash ethereum.Hash, applicationContracts []string) ([]Transfer, error) {
	blockTransactions := make(map[ethereum.Hash]ethereum.Transaction)

	for _, transaction := range transactions {
		blockTransactions[transaction.Hash] = transaction
	}

	transfers := make([]Transfer, 0)
	failedTransactions := make([]ethereum.Hash, 0)

	for _, transferLog := range logs {
		transactionHash := transferLog.TxHash

		var (
			transferContractAddress_ = transferLog.Address.String()
			topics                   = transferLog.Topics
		)

		transferContractAddress := strings.ToLower(transferContractAddress_)

		if !isApplicationContract(transferContractAddress, applicationContracts) {
			log.Debugf(
				"For transaction hash %#v, contract was %#v, not any of %#v!",
				transactionHash,
				transferContractAddress,
				applicationContracts,
			)

			continue
		}

		firstTopic := strings.ToLower(topics[0].String())

		// also check number of topics
		if !IsApplicationLogTopic(firstTopic) {
			log.Debugf(
				"For transaction hash %#v, first topic %#v != any application log topic!",
				transactionHash,
				firstTopic,
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

		logTransaction, found := blockTransactions[transferLog.TxHash]

		if !found {
			failedTransactions = append(failedTransactions, transferLog.TxHash)
		}

		transfer := Transfer{
			FromAddress: fromAddress,
			ToAddress:   toAddress,
			Transaction: logTransaction,
		}

		transfers = append(transfers, transfer)
	}

	var err error

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

// IsTransferLogTopic returns whether given string matches signature of
// the fluid transfer ABI
func IsTransferLogTopic(topic string) bool {
	return topic == TransferLogTopic
}

// IsApplicationLogTopic returns whether given string matches signature of
// any tracked application log
func IsApplicationLogTopic(topic string) bool {
	return topic == applications.UniswapSwapLogTopic
}

// isApplicationContract returns whether the address is found in the list of contracts
func isApplicationContract(address string, contracts []string) bool {
	for _, contract := range contracts {
		if address == contract {
			return true
		}
	}
	return false
}
