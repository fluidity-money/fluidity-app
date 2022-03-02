package ethereum

import (
	"context"
	"fmt"
	"strings"

	logging "github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

var transferLogTopic = strings.ToLower(
	"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
)

type Transfer struct {
	FromAddress ethereum.Address
	ToAddress   ethereum.Address
	Transaction ethereum.Transaction
}

func transactionGetTransfers(client *ethclient.Client, fluidContractAddress ethereum.Address, transaction ethereum.Transaction) ([]Transfer, error) {

	transactionHashString := transaction.Hash.String()

	transactionHash := ethCommon.HexToHash(transactionHashString)

	transactionReceipt, err := client.TransactionReceipt(
		context.Background(),
		transactionHash,
	)

	if err != nil {
		logging.App(func(k *logging.Log) {
			k.Format(
				"Failed to get the transaction receipt for transaction hash %#v! Returning nothing!",
				transactionHashString,
			)

			k.Payload = err
		})

		return nil, nil
	}

	transfers := make([]Transfer, 0)

	for _, log := range transactionReceipt.Logs {

		var (
			transferContractAddress_ = log.Address.Hex()
			topics                   = log.Topics
		)

		transferContractAddress := strings.ToLower(transferContractAddress_)

		if transferContractAddress != string(fluidContractAddress) {
			debug(
				"For transaction hash %#v, contract was %#v, not %#v!",
				transactionHashString,
				transferContractAddress,
				fluidContractAddress,
			)

			continue
		}

		firstTopic := strings.ToLower(topics[0].Hex())

		if firstTopic != transferLogTopic {
			debug(
				"For transaction hash %#v, first topic %#v != transfer log topic %#v!",
				transactionHashString,
				firstTopic,
				transferLogTopic,
			)

			continue
		}

		if len(topics) != 3 {
			debug(
				"Number of topics for transaction hash %#v, topic content %#v length != 3!",
				transactionHashString,
				topics,
			)

			continue
		}

		var (
			fromAddress_ = topics[1].Hex()[26:]
			toAddress_   = topics[2].Hex()[26:]
		)

		fromAddress := ethereum.AddressFromString(fromAddress_)

		toAddress := ethereum.AddressFromString(toAddress_)

		transfer := Transfer{
			FromAddress: fromAddress,
			ToAddress:   toAddress,
			Transaction: transaction,
		}

		transfers = append(transfers, transfer)
	}

	return transfers, nil
}

// GetUserActions by taking the logs from each transaction
func GetTransfers(client *ethclient.Client, contractAddress ethereum.Address, transactions ...ethereum.Transaction) ([]Transfer, error) {

	transfers := make([]Transfer, 0)

	for _, transaction := range transactions {

		transfers_, err := transactionGetTransfers(client, contractAddress, transaction)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get the logs for transaction hash %#v! %v",
				transaction.Hash,
				err,
			)
		}

		transfers = append(transfers, transfers_...)
	}

	return transfers, nil
}

// GetTransferRecipient of the transfer function, returning nil if the
// null address was being sent to
func GetTransferRecipient(transaction ethereum.Transaction) (ethereum.Address, error) {
	return ethereum.AddressFromString("0x0000000000000000000000000000000000000000"), nil
}
