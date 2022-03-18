package main

import (
	"github.com/fluidity-money/fluidity-app/common/solana/pyth"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	solanaQueue "github.com/fluidity-money/fluidity-app/lib/queues/solana"
	"github.com/fluidity-money/fluidity-app/lib/util"
	solanaLibrary "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
	"math/big"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-solana-transactions/lib/saber"
	"github.com/fluidity-money/fluidity-app/cmd/microservice-solana-transactions/lib/solana"
)

const (
	// EnvSolanaRpcUrl is the url used to make Solana HTTP RPC requests
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`
	// EnvSaberSwapProgramid is the program ID of the saber swap program (not router)
	EnvSaberSwapProgramId = `FLU_SOLANA_SABER_SWAP_PROGRAM_ID`
	// EnvSolPythPubkey is the public key of the Pyth price account for SOL
	EnvSolPythPubkey = `FLU_SOLANA_SOL_PYTH_PUBKEY`
)

const (
	// LamportDecimalPlaces to be mindful of when tracking fees paid
	LamportDecimalPlaces = 1e9
)

func main() {
	solanaRpcUrl := util.GetEnvOrFatal(EnvSolanaRpcUrl)
	solanaClient := solanaRpc.New(solanaRpcUrl)

	saberSwapProgramId := util.GetEnvOrFatal(EnvSaberSwapProgramId)

	solPythPubkeyString := util.GetEnvOrFatal(EnvSolPythPubkey)
	solPythPubkey := solanaLibrary.MustPublicKeyFromBase58(solPythPubkeyString)

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
			k.Format("Fetched block %d, transactions %d", slot.Slot, len(block.Transactions))
		})

		solanaPrice, err := pyth.GetPrice(solanaClient, solPythPubkey)

		parsedTransactions := make([]solanaQueue.Transaction, len(block.Transactions))

		for i, transaction := range block.Transactions {
			computeUsed := solana.GetComputeUsed(transaction)
			adjustedFee := new(big.Rat).Mul(computeUsed, new(big.Rat).SetUint64(transaction.Meta.Fee))

			adjustedFee.Quo(adjustedFee, LamportDecimalPlacesRat)
			// normalise to usd
			adjustedFee.Mul(adjustedFee, solanaPrice)

			// saber fee is 0 if an error occurs
			// currently this assumes all saber fees are in USD
			saberFee := saber.GetSaberFees(transaction, saberSwapProgramId)
			adjustedFee.Add(adjustedFee, saberFee)

			parsedTransactions[i] = solanaQueue.Transaction{
				Signature:   transaction.Transaction.Signatures[0],
				Result:      transaction,
				AdjustedFee: adjustedFee,
			}
		}

		transactions := solanaQueue.BufferedTransaction{
			Slot:         slot.Slot,
			Transactions: parsedTransactions,
		}

		queue.SendMessage(solanaQueue.TopicBufferedTransactions, transactions)
	})
}
