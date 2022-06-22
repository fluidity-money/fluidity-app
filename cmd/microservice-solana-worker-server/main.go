package main

import (
	"math/big"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	user_actions "github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	workerTypes "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	"github.com/fluidity-money/fluidity-app/common/solana/solend"

	solanaRpc "github.com/gagliardetto/solana-go/rpc"
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

	// SolanaBlockTime assumed by the ATX calculation
	SolanaBlockTime uint64 = 1

	// SplProgramId is the program id of the SPL token program
	SplProgramId = `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`

	// The compute used by an spl-token tranfer
	SplTransferCompute = 2721
)

func main() {

	var (
		rpcUrl                   = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		solanaNetwork            = util.GetEnvOrFatal(EnvSolanaNetwork)
		topicWrappedActionsQueue = util.GetEnvOrFatal(EnvTopicWrappedActionsQueue)
		topicWinnerQueue         = util.GetEnvOrFatal(EnvTopicWinnerQueue)
		decimalPlaces_           = util.GetEnvOrFatal(EnvTokenDecimals)
		tokenName                = util.GetEnvOrFatal(EnvTokenName)

		fluidMintPubkey = pubkeyFromEnv(EnvFluidityMintPubkey)
		reservePubkey   = pubkeyFromEnv(EnvReservePubkey)
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

	solanaClient := solanaRpc.New(rpcUrl)

	queue.GetMessages(topicWrappedActionsQueue, func(message queue.Message) {

		var payableBufferedUserActions user_actions.PayableBufferedUserAction

		message.Decode(&payableBufferedUserActions)

		var (
			bufferedUserActions = payableBufferedUserActions.BufferedUserAction
			mintSupply          = payableBufferedUserActions.MintSupply
			tvl                 = payableBufferedUserActions.Tvl
			fluidTransfers      = 0
			emission            = workerTypes.NewSolanaEmission()
		)

		// emissions in this loop should only contain information relevant to the
		// entire slot set here so that if any point the loop for the transfers
		// shorts that it'll send out with information relevant to that transfer

		emission.Network = "solana"
		emission.TokenDetails = token_details.New(tokenName, decimalPlaces)

		userActions := bufferedUserActions.UserActions

		for _, userAction := range userActions {

			isSameToken := userAction.TokenDetails.TokenShortName == tokenName

			if userAction.Type == "send" && isSameToken {
				fluidTransfers++
			}
		}

		atx := probability.CalculateAtx(SolanaBlockTime, fluidTransfers)

		apy, err := solend.GetUsdApy(solanaClient, reservePubkey)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get %v apy on Solana! %v",
					tokenName,
					err,
				)
			})
		}

		bpy := probability.CalculateBpy(SolanaBlockTime, apy, emission)

		// normalise the amount to be consistent with USDC as a floating point

		entireAmountOwned := new(big.Rat).SetUint64(mintSupply)

		entireAmountOwned.Quo(entireAmountOwned, decimalPlacesRat)

		// get the size of the pool: obligation value minus deposited value then
		// divide by 10e6 to get the actual number in
		// USDC units

		unscaledPool := tvl - mintSupply

		sizeOfThePool := new(big.Rat).SetUint64(unscaledPool)

		sizeOfThePool.Quo(sizeOfThePool, decimalPlacesRat)

		bpyStakedUsd := probability.CalculateBpyStakedUnderlyingAsset(
			bpy,
			entireAmountOwned,
		)

		for _, userAction := range userActions {

			// skip if it's not a send, or the wrong token

			var (
				userActionTransactionHash  = userAction.TransactionHash
				userActionSenderAddress    = userAction.SenderAddress
				userActionRecipientAddress = userAction.RecipientAddress
			)

			if userAction.Type != "send" {
				continue
			}

			if userAction.TokenDetails.TokenShortName != tokenName {
				continue
			}

			// send emissions out that can be actioned on when the loop ends

			emission.TransactionHash = userActionTransactionHash
			emission.RecipientAddress = userActionRecipientAddress
			emission.SenderAddress = userActionSenderAddress

			// track fees used during this user action
			emission.Fees.Saber, _ = userAction.SaberFee.Float64()

			tribecaDataStoreTrfVars := payout.GetLatestTrfVars(TrfChain, solanaNetwork)

			var (
				winningClasses   = tribecaDataStoreTrfVars.WinningClasses
				payoutFreqNum    = tribecaDataStoreTrfVars.PayoutFreqNum
				payoutFreqDenom  = tribecaDataStoreTrfVars.PayoutFreqDenom
				deltaWeightNum   = tribecaDataStoreTrfVars.DeltaWeightNum
				deltaWeightDenom = tribecaDataStoreTrfVars.DeltaWeightDenom
			)

			var (
				payoutFreq  = big.NewRat(payoutFreqNum, payoutFreqDenom)
				deltaWeight = big.NewRat(deltaWeightNum, deltaWeightDenom)
			)

			solanaTransactionFeesNormalised := userAction.AdjustedFee

			randomN, randomPayouts := probability.WinningChances(
				solanaTransactionFeesNormalised,
				atx,
				bpyStakedUsd,
				sizeOfThePool,
				decimalPlacesRat,
				payoutFreq,
				deltaWeight,
				winningClasses,
				fluidTransfers,
				SolanaBlockTime,
				emission,
			)

			randomIntegers := generateRandomIntegers(
				winningClasses,
				1,
				int(randomN),
			)

			randomSource := make([]uint32, len(randomIntegers))

			for i, randomInteger := range randomIntegers {
				randomSource[i] = uint32(randomInteger)
			}

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

			queue.SendMessage(worker.TopicEmissions, emission)
		}
	})
}
