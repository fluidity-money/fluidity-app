package main

import (
	"math/big"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	solanaQueue "github.com/fluidity-money/fluidity-app/lib/queues/solana"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-solana-transactions/lib/solana"
)

// EnvSolanaRpcUrl is the url used to make Solana HTTP RPC requests
const EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

func main() {
	solanaRpcUrl := util.GetEnvOrFatal(EnvSolanaRpcUrl)

	solanaQueue.Slots(func (slot solanaQueue.Slot) {
		block, err := solana.GetBlock(solanaRpcUrl, slot.Slot)

		if err != nil {
			log.Fatal(func (k *log.Log) {
				k.Format("Failed to fetch solana block %d!", slot.Slot)
				k.Payload = err
			})
		}

		log.Debug(func (k *log.Log) {
			k.Format("Fetched block %d, transactions %d", slot.Slot, len(block.Transactions))
		})

		parsedTransactions := make([]solanaQueue.Transaction, len(block.Transactions))

		for i, transaction := range block.Transactions {
			computeUsed := solana.GetComputeUsed(transaction)
			adjustedFee := new(big.Rat).Mul(computeUsed, new(big.Rat).SetUint64(transaction.Meta.Fee))

			parsedTransactions[i] = solanaQueue.Transaction{
				Signature: transaction.Transaction.Signatures[0],
				Result: transaction,
				AdjustedFee: adjustedFee,
			}
		}

		transactions := solanaQueue.BufferedTransaction {
			Slot: slot.Slot,
			Transactions: parsedTransactions,
		}

		queue.SendMessage(solanaQueue.TopicBufferedTransactions, transactions)
	})
}
