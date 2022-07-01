package ethereum

import (
	"fmt"
	"strings"

	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

var TransferLogTopic = strings.ToLower(
	"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
)

// Get transfer receipts
func GetTransfers(logs []ethereum.Log, transactions []ethereum.Transaction, blockHash ethereum.Hash, fluidContractAddress ethereum.Address) ([]worker.EthereumDecoratedTransfer, error) {
	blockTransactions := make(map[ethereum.Hash]ethereum.Transaction)

	for _, transaction := range transactions {
		blockTransactions[transaction.Hash] = transaction
	}

	transfers := make([]worker.EthereumDecoratedTransfer, 0)
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

		transfer := worker.EthereumDecoratedTransfer{
			SenderAddress:    fromAddress,
			RecipientAddress: toAddress,
			Transaction:      logTransaction,
			Decorator:        nil,
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

// GetApplicationTransfers to classify individual logs and their respective transactions
// as generated by an application we support, to be processed later
func GetApplicationTransfers(logs []ethereum.Log, transactions []ethereum.Transaction, blockHash ethereum.Hash, applicationContracts []string) ([]worker.EthereumApplicationTransfer, error) {
	blockTransactions := make(map[ethereum.Hash]ethereum.Transaction)

	for _, transaction := range transactions {
		blockTransactions[transaction.Hash] = transaction
	}

	var (
		transfers          []worker.EthereumApplicationTransfer
		failedTransactions []ethereum.Hash
	)

	for _, transferLog := range logs {
		transactionHash := transferLog.TxHash

		var (
			transferContractAddress_ = transferLog.Address.String()
			topics                   = transferLog.Topics
		)

		transferContractAddress := strings.ToLower(transferContractAddress_)

		if !IsApplicationContract(transferContractAddress, applicationContracts) {
			log.Debugf(
				"For transaction hash %#v, contract was %#v, not any of %#v!",
				transactionHash,
				transferContractAddress,
				applicationContracts,
			)

			continue
		}

		if len(topics) == 0 {
			log.Debugf(
				"For transaction hash %#v, no topics were found!",
				transactionHash,
			)

			continue
		}

		firstTopic := strings.ToLower(topics[0].String())
		logApplication := ClassifyApplicationLogTopic(firstTopic)

		// also check number of topics
		if logApplication == 0 {
			log.Debugf(
				"For transaction hash %#v, first topic %#v != any application log topic!",
				transactionHash,
				firstTopic,
			)

			continue
		}

		logTransaction, found := blockTransactions[transferLog.TxHash]

		if !found {
			failedTransactions = append(failedTransactions, transferLog.TxHash)
		}

		transfer := worker.EthereumApplicationTransfer{
			Transaction: logTransaction,
			Log:         transferLog,
			Application: logApplication,
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

// IsTransferLogTopic returns whether given string matches signature of
// the fluid transfer ABI
func IsTransferLogTopic(topic string) bool {
	return topic == TransferLogTopic
}

// ClassifyApplicationLogTopic returns a classification of which supported application
// a given topic corresponds to, if any
func ClassifyApplicationLogTopic(topic string) applications.Application {
	switch topic {
	case applications.UniswapSwapLogTopic:
		return applications.ApplicationUniswapV2
	case applications.OneInchSwapLogTopic:
		return applications.ApplicationOneInchSwap
	case applications.MooniswapSwapLogTopic:
		return applications.ApplicationMooniswap
	default:
		return applications.ApplicationNone
	}
}

// ClassifyApplicationContract returns whether the address is found in the list of contracts
func IsApplicationContract(address string, contracts []string) bool {
	for _, contract := range contracts {
		if address == contract {
			return true
		}
	}
	return false
}
