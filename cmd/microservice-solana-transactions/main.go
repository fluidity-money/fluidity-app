package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	solanaQueue "github.com/fluidity-money/fluidity-app/lib/queues/solana"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/solana/pyth"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-solana-transactions/lib/saber"
	"github.com/fluidity-money/fluidity-app/cmd/microservice-solana-transactions/lib/solana"

	solanaLibrary "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

const (
	// EnvSolanaRpcUrl is the url used to make Solana HTTP RPC requests
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvSaberSwapProgramid is the program ID of the saber swap program (not router)
	EnvSaberSwapProgramId = `FLU_SOLANA_SABER_SWAP_PROGRAM_ID`

	// EnvSaberRpcUrl to use when making lookups to their infrastructure
	EnvSaberRpcUrl = `FLU_SOLANA_SABER_RPC_URL`

	// EnvSolPythPubkey is the public key of the Pyth price account for SOL
	EnvSolPythPubkey = `FLU_SOLANA_SOL_PYTH_PUBKEY`
)

const (
	// LamportDecimalPlaces to be mindful of when tracking fees paid
	LamportDecimalPlaces = 1e9
)

func main() {
	var (
		solanaRpcUrl        = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		saberRpcUrl         = util.GetEnvOrFatal(EnvSaberRpcUrl)
		saberSwapProgramId  = util.GetEnvOrFatal(EnvSaberSwapProgramId)
		solPythPubkeyString = util.GetEnvOrFatal(EnvSolPythPubkey)
	)

	solPythPubkey := solanaLibrary.MustPublicKeyFromBase58(solPythPubkeyString)

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

		parsedTransactions := make([]solanaQueue.Transaction, len(block.Transactions))

		for i, transaction := range block.Transactions {

			transactionMetaFeeRat := new(big.Rat).SetUint64(transaction.Meta.Fee)

			transactionMetaFeeRat.Quo(transactionMetaFeeRat, LamportDecimalPlacesRat)

			// normalise to usd

			transactionMetaFeeRat.Mul(transactionMetaFeeRat, solanaPrice)

			// saber fee is 0 if an error occurs
			// currently this assumes all saber fees are in USD

			saberFee, _, err := saber.GetSaberFees(
				saberRpcUrl,
				transaction,
				saberSwapProgramId,
			)

			if err != nil {
				log.App(func(k *log.Log) {
					k.Message = "Destructured a log containing a Saber transfer, but failed to make a lookup!"
					k.Payload = err
				})
			}

			transactionMetaFeeRat.Add(transactionMetaFeeRat, saberFee)

			parsedTransactions[i] = solanaQueue.Transaction{
				Signature:   transaction.Transaction.Signatures[0],
				Result:      transaction,
				AdjustedFee: transactionMetaFeeRat,
				SaberFee:    saberFee,
			}
		}

		transactions := solanaQueue.BufferedTransaction{
			Slot:         slot.Slot,
			Transactions: parsedTransactions,
		}

		queue.SendMessage(solanaQueue.TopicBufferedTransactions, transactions)
	})
}
