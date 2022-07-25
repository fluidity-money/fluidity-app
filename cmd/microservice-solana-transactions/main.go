package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	solanaQueue "github.com/fluidity-money/fluidity-app/lib/queues/solana"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/solana/pyth"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-solana-transactions/lib/solana"

	solanaLib "github.com/fluidity-money/fluidity-app/common/solana"
	solanaLibrary "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

const (
	// EnvSolanaRpcUrl is the url used to make Solana HTTP RPC requests
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvSolPythPubkey is the public key of the Pyth price account for SOL
	EnvSolPythPubkey = `FLU_SOLANA_SOL_PYTH_PUBKEY`

	// EnvApplicationList is a list of applications in the form
	// name:addresses,etc for classifying app transactions with
	EnvApplicationList = `FLU_SOLANA_APPLICATIONS_LIST`
)

const (
	// LamportDecimalPlaces to be mindful of when tracking fees paid
	LamportDecimalPlaces = 1e9
)

func main() {
	var (
		solanaRpcUrl        = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		solPythPubkeyString = util.GetEnvOrFatal(EnvSolPythPubkey)
		applicationsString  = util.GetEnvOrFatal(EnvApplicationList)

		applications        = parseApplications(applicationsString)
	)

	solPythPubkey, err := solanaLibrary.PublicKeyFromBase58(
		solPythPubkeyString,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to decode %v pyth public key %#v",
				EnvSolPythPubkey,
				solPythPubkeyString,
			)

			k.Payload = err
		})
	}

	solanaClient := solanaRpc.New(solanaRpcUrl)

	LamportDecimalPlacesRat := big.NewRat(LamportDecimalPlaces, 1)

	solanaQueue.Slots(func(slot solanaQueue.Slot) {
		block, err := solana.GetBlock(solanaRpcUrl, slot.Slot)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("Failed to fetch solana block %d!", slot.Slot)
				k.Payload = err
			})
		}

		log.Debug(func(k *log.Log) {
			k.Format(
				"Fetched block %d, transactions %d",
				slot.Slot,
				len(block.Transactions),
			)
		})

		solanaPrice, err := pyth.GetPrice(solanaClient, solPythPubkey)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get the sol-USD price from pyth!"
				k.Payload = err
			})
		}

		parsedTransactions := make([]worker.SolanaApplicationTransaction, 0)

		for _, transaction := range block.Transactions {
			app := solanaLib.ClassifyApplication(transaction, applications)

			if app == nil {
				log.Debugf(
					"Transaction %v didn't have an application classified!",
					transaction,
				)

				continue
			}

			transactionFeeUsd := new(big.Rat).SetUint64(transaction.Meta.Fee)

			transactionFeeUsd.Quo(transactionFeeUsd, LamportDecimalPlacesRat)

			// normalise to usd

			transactionFeeUsd.Mul(transactionFeeUsd, solanaPrice)

			parsed := worker.SolanaApplicationTransaction{
				Signature:   transaction.Transaction.Signatures[0],
				Result:      transaction,
				AdjustedFee: transactionFeeUsd,
				Application: *app,
			}

			parsedTransactions = append(parsedTransactions, parsed)
		}

		transactions := worker.SolanaBufferedApplicationTransactions{
			Slot:         slot.Slot,
			Transactions: parsedTransactions,
		}

		queue.SendMessage(solanaQueue.TopicBufferedTransactions, transactions)
	})
}
