package main

import (
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/solana"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
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
	EnvTokenShortName    = `FLU_SOLANA_TOKEN_SHORT_NAME`

	// EnvTokenDecimals is the number of decimals the token uses
	EnvTokenDecimals     = `FLU_SOLANA_TOKEN_DECIMALS`
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

	solana.BufferedTransactions(func(bufferedTransaction solana.BufferedTransaction) {
		var (
			slotNumber   = bufferedTransaction.Slot
			transactions = bufferedTransaction.Transactions
		)

		bufferedUserActions := make([]user_actions.UserAction, 0)

		for _, transaction := range transactions {
			if err := transaction.Result.Meta.Err; err != nil {
				log.Debug(func(k *log.Log) {
					k.Message = "Skipping failed transaction!"
					k.Payload = err
				})

				continue
			}

			var (
				signature         = transaction.Signature
				accountKeys       = transaction.Result.Transaction.Message.AccountKeys
				tokenBalances     = transaction.Result.Meta.PostTokenBalances
				instructions      = transaction.Result.Transaction.Message.Instructions
				innerInstructions = transaction.Result.Meta.InnerInstructions
				adjustedFee       = transaction.AdjustedFee
				sig               = transaction.Signature
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

			allInstructions := append(instructions, innerInstructions...)

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
						sig,
						instruction,
						accountKeys,
						fluidityOwners,
						tokenDetails,
					)

				case SplProgramId:
					transfer1, transfer2, err = processSplTransaction(
						sig,
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
					bufferedUserActions = append(bufferedUserActions, *transfer1)
				}

				if transfer2 != nil {
					bufferedUserActions = append(bufferedUserActions, *transfer2)
				}

				if winner1 != nil {
					queue.SendMessage(winners.TopicWinnersSolana, winner1)
				}

				if winner2 != nil {
					queue.SendMessage(winners.TopicWinnersSolana, winner2)
				}

				if swapWrap != nil {
					bufferedUserActions = append(bufferedUserActions, *swapWrap)
				}

				if swapUnwrap != nil {
					bufferedUserActions = append(bufferedUserActions, *swapUnwrap)
				}
			}
		}

		if len(bufferedUserActions) == 0 {
			return
		}

		bufferedUserAction := user_actions.BufferedUserAction{
			UserActions: bufferedUserActions,
		}

		queue.SendMessage(user_actions.TopicBufferedUserActionsSolana, bufferedUserAction)
	})
}
