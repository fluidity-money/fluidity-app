package main

import (
	"strconv"

	solLib "github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/solana"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvFluidityProgramId is the ID of the fluidity program
	EnvFluidityProgramId = `FLU_SOLANA_PROGRAM_ID`

	// EnvFluidityTokenMint is the address used for the fluid token mint
	EnvFluidityTokenMint = `FLU_SOLANA_FLUID_MINT_PUBKEY`

	// EnvFluidityPdaPubkey is the public key of the fluidity derived account
	EnvFluidityPdaPubkey = `FLU_SOLANA_PDA_PUBKEY`

	// EnvTokenShortName is the abbreviation of the non-fluid token name
	EnvTokenShortName = `FLU_SOLANA_TOKEN_SHORT_NAME`

	// EnvTokenDecimals is the number of decimals the token uses
	EnvTokenDecimals = `FLU_SOLANA_TOKEN_DECIMALS`
)

// SplProgramId is the program id of the SPL token program
const SplProgramId = `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`

func main() {
	var (
		fluidityProgramId = util.GetEnvOrFatal(EnvFluidityProgramId)
		fluidityTokenMint = util.GetEnvOrFatal(EnvFluidityTokenMint)
		fluidityPdaPubkey = util.GetEnvOrFatal(EnvFluidityPdaPubkey)
		tokenShortName    = util.GetEnvOrFatal(EnvTokenShortName)
		tokenDecimals_    = util.GetEnvOrFatal(EnvTokenDecimals)
	)

	tokenDecimals, err := strconv.Atoi(tokenDecimals_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to parse token decimals from env! Got %v but expected an int!",
				tokenDecimals,
			)
		})
	}

	tokenDetails := token_details.New(tokenShortName, tokenDecimals)

	solana.BufferedTransactions(func(bufferedTransaction solana.BufferedApplicationTransactions) {
		var (
			slotNumber   = bufferedTransaction.Slot
			transactions = bufferedTransaction.Transactions
		)

		var (
			bufferedUserActions        = make([]user_actions.UserAction, 0)
			bufferedParsedTransactions = make([]worker.SolanaParsedTransaction, 0)
		)

		for _, transaction := range transactions {
			if err := transaction.Result.Meta.Err; err != nil {
				log.Debug(func(k *log.Log) {
					k.Message = "Skipping failed transaction!"
					k.Payload = err
				})

				continue
			}

			var (
				transfers = make([]user_actions.UserAction, 0)

				signature         = transaction.Signature
				transactionResult = transaction.Result
				accountKeys       = transactionResult.Transaction.Message.AccountKeys
				tokenBalances     = transactionResult.Meta.PostTokenBalances
				adjustedFee       = transaction.AdjustedFee
			)

			log.Debug(func(k *log.Log) {
				k.Format(
					"Processing a transaction with signature %#v in slot %#v!",
					signature,
					slotNumber,
				)
			})

			// owner address if the account at index is a fluidity token account, "" otherwise

			fluidityOwners := make([]string, len(accountKeys))

			for _, bal := range tokenBalances {
				if bal.Mint == fluidityTokenMint {
					fluidityOwners[bal.AccountIndex] = bal.Owner
				}
			}

			allInstructions := solLib.GetAllInstructions(transactionResult)

			for _, instruction := range allInstructions {

				var (
					winner1 *winners.Winner
					winner2 *winners.Winner

					swapWrap   *user_actions.UserAction
					swapUnwrap *user_actions.UserAction

					transfer1 *user_actions.UserAction
					transfer2 *user_actions.UserAction

					err error
				)

				switch accountKeys[instruction.ProgramIdIndex] {
				case fluidityProgramId:
					winner1, winner2, swapWrap, swapUnwrap, err = processFluidityTransaction(
						signature,
						instruction,
						accountKeys,
						fluidityOwners,
						tokenDetails,
					)

				case SplProgramId:
					transfer1, transfer2, err = processSplTransaction(
						signature,
						instruction,
						adjustedFee,
						accountKeys,
						fluidityOwners,
						fluidityTokenMint,
						fluidityPdaPubkey,
						tokenDetails,
					)
				}

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Message = "Failed to process a Fluidity transaction!"
						k.Payload = err
					})
				}

				if transfer1 != nil {
					log.App(func(k *log.Log) {
						k.Message = "Found a transfer!"
					})

					transfers = append(transfers, *transfer1)
					bufferedUserActions = append(bufferedUserActions, *transfer1)
				}

				if transfer2 != nil {
					log.App(func(k *log.Log) {
						k.Message = "Found a transfer!"
					})

					transfers = append(transfers, *transfer2)
					bufferedUserActions = append(bufferedUserActions, *transfer2)
				}

				if winner1 != nil {
					log.App(func(k *log.Log) {
						k.Message = "Found a winner!"
					})

					queue.SendMessage(winners.TopicWinnersSolana, winner1)
				}

				if winner2 != nil {
					log.App(func(k *log.Log) {
						k.Message = "Found a winner!"
					})

					queue.SendMessage(winners.TopicWinnersSolana, winner2)
				}

				if swapWrap != nil {
					log.App(func(k *log.Log) {
						k.Message = "Found a wrap!"
					})

					bufferedUserActions = append(bufferedUserActions, *swapWrap)
				}

				if swapUnwrap != nil {
					log.App(func(k *log.Log) {
						k.Message = "Found an unwrap!"
					})

					bufferedUserActions = append(bufferedUserActions, *swapUnwrap)
				}

			}

			// always pass transactions to the apps server
			parsedTransaction := worker.SolanaParsedTransaction{
				Transaction: transaction,
				Transfers:   transfers,
			}

			bufferedParsedTransactions = append(
				bufferedParsedTransactions,
				parsedTransaction,
			)
		}

		if len(bufferedParsedTransactions) != 0 {
			bufferedTransactionsBlock := worker.SolanaBufferedParsedTransactions{
				Transactions: bufferedParsedTransactions,
				Slot:         slotNumber,
			}

			queue.SendMessage(worker.TopicSolanaParsedTransactions, bufferedTransactionsBlock)
		}

		if len(bufferedUserActions) != 0 {
			bufferedUserAction := user_actions.BufferedUserAction{
				UserActions: bufferedUserActions,
			}

			queue.SendMessage(
				user_actions.TopicBufferedUserActionsSolana,
				bufferedUserAction,
			)
		}
	})
}
