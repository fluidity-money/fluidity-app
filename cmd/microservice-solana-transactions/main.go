package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	solanaLib "github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/pyth"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	solanaQueue "github.com/fluidity-money/fluidity-app/lib/queues/solana"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-solana-transactions/lib/solana"
)

const (
	// EnvSolanaRpcUrl is the url used to make Solana HTTP RPC requests
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvSolPythPubkey is the public key of the Pyth price account for SOL
	EnvSolPythPubkey = `FLU_SOLANA_SOL_PYTH_PUBKEY`

	// EnvApplicationList is a list of applications in the form
	// name:addresses,etc for classifying app transactions with
	EnvApplicationList = `FLU_SOLANA_APPLICATIONS_LIST`

	// EnvRetries is the number of times to retry block fetching
	// if a block doesn't exist yet
	EnvRetries = `FLU_SOLANA_BLOCK_RETRIES`

	// EnvRetryDelay is the number of seconds to wait before retrying
	// fetching a block
	EnvRetryDelay = `FLU_SOLANA_BLOCK_RETRY_DELAY`
)

const (
	// LamportDecimalPlaces to be mindful of when tracking fees paid
	LamportDecimalPlaces = 1e9
)

func main() {
	var (
		solanaRpcUrl = util.PickEnvOrFatal(EnvSolanaRpcUrl)

		solPythPubkeyString = util.GetEnvOrFatal(EnvSolPythPubkey)
		applicationsString  = util.GetEnvOrFatal(EnvApplicationList)

		applications = parseApplications(applicationsString)

		retries = intFromEnvOrFatal(EnvRetries)
		delay   = intFromEnvOrFatal(EnvRetryDelay)
	)

	solPythPubkey, err := solanaLib.PublicKeyFromBase58(
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

	solanaClient, err := rpc.New(solanaRpcUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the Solana RPC client!"
			k.Payload = err
		})
	}

	LamportDecimalPlacesRat := big.NewRat(LamportDecimalPlaces, 1)

	solanaQueue.Slots(func(slot solanaQueue.Slot) {
		block, err := solana.GetBlock(solanaRpcUrl, slot.Slot, retries, delay)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("Failed to fetch solana block %d!", slot.Slot)
				k.Payload = err
			})
		}

		if block == nil {
			log.App(func(k *log.Log) {
				k.Format("Block %d was skipped by solana!", slot.Slot)
			})

			return
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
			apps := solanaLib.ClassifyApplication(transaction, applications)

			if len(apps) == 0 {
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
				Signature:    transaction.Transaction.Signatures[0],
				Result:       transaction,
				AdjustedFee:  transactionFeeUsd,
				Applications: apps,
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
