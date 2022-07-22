package main

import (
	"encoding/json"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/common/solana/orca"
	"github.com/fluidity-money/fluidity-app/common/solana/raydium"
	"github.com/fluidity-money/fluidity-app/common/solana/saber"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	types "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

const (
	// EnvSolanaRpcUrl is the url used to make Solana HTTP RPC requests
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvSolanaTokenLookups is the map of fluid -> base tokens
	EnvSolanaTokenLookups = `FLU_SOLANA_TOKEN_LOOKUPS`

	// EnvSaberSwapProgramid is the program ID of the saber swap program (not router)
	EnvSaberSwapProgramId = `FLU_SOLANA_SABER_SWAP_PROGRAM_ID`

	// EnvSaberRpcUrl to use when making lookups to their infrastructure
	EnvSaberRpcUrl = `FLU_SOLANA_SABER_RPC_URL`

	// EnvOrcaProgramId is the program ID of the orca swap program
	EnvOrcaProgramId = `FLU_SOLANA_ORCA_PROGRAM_ID`

	// EnvRaydiumProgramId is the program ID of the Raydium swap program
	EnvRaydiumProgramId = `FLU_SOLANA_RAYDIUM_PROGRAM_ID`
)

func main() {
	var (
		solanaRpcUrl       = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		fluidTokenString   = util.GetEnvOrFatal(EnvSolanaTokenLookups)
		saberRpcUrl        = util.GetEnvOrFatal(EnvSaberRpcUrl)
		saberSwapProgramId = util.GetEnvOrFatal(EnvSaberSwapProgramId)
		orcaProgramId      = util.GetEnvOrFatal(EnvOrcaProgramId)
		raydiumProgramId   = util.GetEnvOrFatal(EnvRaydiumProgramId)
	)

	var fluidTokens map[string]string

	err := json.Unmarshal([]byte(fluidTokenString), &fluidTokens)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"failed to unmarshal fluid to base token map from env string %#v!",
				fluidTokenString,
			)
			k.Payload = err
		})
	}

	solanaClient := solanaRpc.New(solanaRpcUrl)

	worker.GetSolanaBufferedParsedTransactions(func(transactions worker.SolanaBufferedParsedTransactions) {
		transfers := make([]worker.SolanaDecoratedTransfer, 0)

		for transactionNumber, transaction := range transactions.Transactions {
			var (
				transactionApp       = transaction.Transaction.Application
				transactionSignature = transaction.Transaction.Signature
			)

			decorated, err := parseTransaction(
				solanaClient,
				fluidTokens,
				transaction,
				saberRpcUrl,
				saberSwapProgramId,
				orcaProgramId,
				raydiumProgramId,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to parse an application at transaction %v! %w",
						transactionNumber,
						err,
					)
				})
			}

			if decorated == nil {
				log.App(func(k *log.Log) {
					k.Format(
						"Application didn't return a transfer, app index %d, transaction %s",
						transactionApp,
						transactionSignature,
					)
				})

				continue
			}

			transfers = append(transfers, decorated...)
		}

		bufferedTransfers := worker.SolanaBufferedTransfers{
			Transfers: transfers,
		}

		queue.SendMessage(
			worker.TopicSolanaBufferedTransfers,
			bufferedTransfers,
		)
	})
}

func parseTransaction(solanaClient *solanaRpc.Client, fluidTokens map[string]string, transaction worker.SolanaParsedTransaction, saberRpc, saberProgramId, orcaProgramId, raydiumProgramId string) ([]worker.SolanaDecoratedTransfer, error) {
	var (
		fee *big.Rat
		err error
	)

	var (
		transactionResult      = transaction.Transaction.Result
		transactionSignature   = transaction.Transaction.Signature
		transactionApplication = transaction.Transaction.Application
	)

	switch transactionApplication {
	case applications.ApplicationSaber:
		fee, _, err = saber.GetSaberFees(saberRpc, transactionResult, saberProgramId)

	case applications.ApplicationOrca:
		fee, err = orca.GetOrcaFees(
			solanaClient,
			transactionResult,
			orcaProgramId,
			fluidTokens,
		)

	case applications.ApplicationRaydium:
		fee, err = raydium.GetRaydiumFees(
			solanaClient,
			transactionResult,
			raydiumProgramId,
			fluidTokens,
		)

	default:
		err = fmt.Errorf(
			"application number wasn't expected: %v",
			transactionApplication,
		)
	}

	if err != nil {
		return nil, fmt.Errorf(
			"application decoding failed for parsed transaction %#v: %v",
			transactionSignature,
			err,
		)
	}

	var (
		transfers      = transaction.Transfers
		appTransaction = transaction.Transaction
		decorated      = make([]worker.SolanaDecoratedTransfer, len(transfers))
	)

	for i, transfer := range transfers {
		var (
			token          = transfer.TokenDetails
			senderSpl      = transfer.SenderAddress
			recipientSpl   = transfer.RecipientAddress
			senderOwner    = transfer.SolanaSenderOwnerAddress
			recipientOwner = transfer.SolanaRecipientOwnerAddress
		)

		var decorator *types.SolanaWorkerDecorator

		if fee != nil {
			decorator_ := types.SolanaWorkerDecorator{
				ApplicationFee: fee,
			}

			decorator = &decorator_
		}

		decoratedTransfer := worker.SolanaDecoratedTransfer{
			Transaction:           appTransaction,
			Token:                 token,
			SenderSplAddress:      senderSpl,
			RecipientSplAddress:   recipientSpl,
			SenderOwnerAddress:    senderOwner,
			RecipientOwnerAddress: recipientOwner,
			Decorator:             decorator,
		}

		decorated[i] = decoratedTransfer
	}

	return decorated, nil
}
