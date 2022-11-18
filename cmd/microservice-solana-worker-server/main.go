// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"
	"strconv"

	worker_config "github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	worker_types "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvSolanaNetwork is the network of the trf data store account
	EnvSolanaNetwork = `FLU_SOLANA_NETWORK`

	// EnvFluidityMintPubkey is the public key of the fluid token mint
	EnvFluidityMintPubkey = `FLU_SOLANA_FLUID_MINT_PUBKEY`

	// EnvReservePubkey is the public key of the solend pool reserve account
	EnvReservePubkey = `FLU_SOLANA_RESERVE_PUBKEY`

	// EnvTokenDecimals is the number of decimals the token uses
	EnvTokenDecimals = `FLU_SOLANA_TOKEN_DECIMALS`

	// EnvTokenName is the same of the token being wrapped
	EnvTokenName = `FLU_SOLANA_TOKEN_NAME`

	// EnvTopicWrappedActionsQueue to use when receiving TVL, mint
	// supply, and user actions from retriever
	EnvTopicWrappedActionsQueue = `FLU_SOLANA_WRAPPED_ACTIONS_QUEUE_NAME`

	// EnvTopicWinnerQueue to use when transmitting to a client the topic of
	// a winner
	EnvTopicWinnerQueue = `FLU_SOLANA_WINNER_QUEUE_NAME`
)

const (
	// Chain for filtering TRF var in Timescale
	TrfChain = `solana`

	// SplProgramId is the program id of the SPL token program
	SplProgramId = `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`
)

func main() {

	var (
		topicWrappedActionsQueue = util.GetEnvOrFatal(EnvTopicWrappedActionsQueue)
		topicWinnerQueue         = util.GetEnvOrFatal(EnvTopicWinnerQueue)
		decimalPlaces_           = util.GetEnvOrFatal(EnvTokenDecimals)
		tokenName                = util.GetEnvOrFatal(EnvTokenName)

		fluidMintPubkey = pubkeyFromEnv(EnvFluidityMintPubkey)
	)

	decimalPlaces, err := strconv.Atoi(decimalPlaces_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to convert the decimals from %v! Was %#v!",
				decimalPlaces_,
				decimalPlaces,
			)
		})
	}

	decimalPlacesRat := raiseDecimalPlaces(decimalPlaces)

	queue.GetMessages(topicWrappedActionsQueue, func(message queue.Message) {

		var bufferedTransfers worker.SolanaWork

		message.Decode(&bufferedTransfers)

		var (
			transfers      = bufferedTransfers.BufferedTransfers
			mintSupply     = bufferedTransfers.MintSupply
			tvl            = bufferedTransfers.Tvl
			fluidTransfers = 0
			emission       = worker_types.NewSolanaEmission()
		)

		workerConfig := worker_config.GetWorkerConfigSolana()

		solanaBlockTime := workerConfig.SolanaBlockTime

		// emissions in this loop should only contain information relevant to the
		// entire slot set here so that if any point the loop for the transfers
		// shorts that it'll send out with information relevant to that transfer

		emission.Network = "solana"
		emission.TokenDetails = token_details.New(tokenName, decimalPlaces)

		userActions := transfers.Transfers

		for _, userAction := range userActions {

			isSameToken := userAction.Token.TokenShortName == tokenName

			if isSameToken {
				fluidTransfers++
			}
		}

		atx := probability.CalculateAtx(solanaBlockTime, fluidTransfers)

		// normalise the amount to be consistent with USDC as a floating point

		entireAmountOwned := new(big.Rat).SetUint64(mintSupply)

		entireAmountOwned.Quo(entireAmountOwned, decimalPlacesRat)

		// get the size of the pool: obligation value minus deposited value then
		// divide by 10e6 to get the actual number in
		// USDC units

		unscaledPool := tvl - mintSupply

		sizeOfThePool := new(big.Rat).SetUint64(unscaledPool)

		sizeOfThePool.Quo(sizeOfThePool, decimalPlacesRat)

		for _, userAction := range userActions {
			var (
				userActionTransactionHash  = userAction.Transaction.Signature
				userActionSenderAddress    = userAction.SenderSplAddress
				userActionRecipientAddress = userAction.RecipientSplAddress
				userActionSlotNumber       = int64(userAction.Transaction.Result.Slot)
				tokenDetails               = userAction.Token
				userActionAppEmission      = userAction.AppEmissions
			)

			// skip if it's not a send, or the wrong token
			if tokenDetails.TokenShortName != tokenName {
				continue
			}

			// send emissions out that can be actioned on when the loop ends

			emission.TransactionHash = userActionTransactionHash
			emission.RecipientAddress = userActionRecipientAddress
			emission.SenderAddress = userActionSenderAddress

			emission.SolanaAppFees = userActionAppEmission

			slotNumber_ := misc.BigIntFromInt64(userActionSlotNumber)
			emission.SolanaSlotNumber = slotNumber_

			var (
				winningClasses   = fluidity.WinningClasses
				payoutFreqNum    = fluidity.PayoutFreqNum
				payoutFreqDenom  = fluidity.PayoutFreqDenom
				deltaWeightNum   = fluidity.DeltaWeightNum
				deltaWeightDenom = fluidity.DeltaWeightDenom
			)

			var (
				payoutFreq  = big.NewRat(payoutFreqNum, payoutFreqDenom)
				deltaWeight = big.NewRat(deltaWeightNum, deltaWeightDenom)
			)

			solanaTransactionFeesNormalised := userAction.Transaction.AdjustedFee

			if userAction.Decorator != nil {
				appFee := userAction.Decorator.ApplicationFee

				solanaTransactionFeesNormalised.Add(
					solanaTransactionFeesNormalised,
					appFee,
				)
			}

			randomN, randomPayouts, _ := probability.WinningChances(
				solanaTransactionFeesNormalised,
				atx,
				sizeOfThePool,
				decimalPlacesRat,
				payoutFreq,
				deltaWeight,
				winningClasses,
				fluidTransfers,
				solanaBlockTime,
				emission,
			)

			randomSource := generateRandomIntegers(
				winningClasses,
				1,
				uint32(randomN),
			)

			// then finally, you'd figure out if they won!

			matchedBalls := probability.NaiveIsWinning(
				randomSource,
				emission,
			)

			if matchedBalls <= 0 {
				log.App(func(k *log.Log) {
					k.Format(
						"Transaction hash %s contains no winning balls!",
						userActionTransactionHash,
					)
				})

				sendEmission(emission)

				continue
			}

			winningAmountBigInt := randomPayouts[matchedBalls-1]

			if !winningAmountBigInt.IsUint64() {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Winning amount %s is too large to be represented as a u64!",
						winningAmountBigInt.String(),
					)
				})
			}

			winningAmount := winningAmountBigInt.Uint64()

			log.Debug(func(k *log.Log) {
				k.Format(
					"Found winning transaction %v winning %v tokens!",
					userAction,
					winningAmount,
				)
			})

			log.App(func(k *log.Log) {
				k.Format(
					"Transaction hash %s won %v!",
					userActionTransactionHash,
					winningAmount,
				)
			})

			// don't bother paying out if the unlucky winner won nothing

			if winningAmount <= 0 {
				sendEmission(emission)
				continue
			}

			// send a message to the client that will kick off the payment of the
			// winnings!

			winnerAnnouncement := worker.SolanaWinnerAnnouncement{
				WinningTransactionHash: userActionTransactionHash,
				SenderAddress:          userActionSenderAddress,
				RecipientAddress:       userActionRecipientAddress,
				WinningAmount:          winningAmount,
				TokenName:              tokenName,
				FluidMintPubkey:        fluidMintPubkey.String(),
			}

			queue.SendMessage(topicWinnerQueue, winnerAnnouncement)

			sendEmission(emission)
		}
	})
}
