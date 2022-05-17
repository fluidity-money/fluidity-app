package main

import (
	"math/big"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	user_actions "github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	workerTypes "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	prize_pool "github.com/fluidity-money/fluidity-app/common/solana/prize-pool"
	"github.com/fluidity-money/fluidity-app/common/solana/solend"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvFluidityPubkey is the program id of the fluidity program
	EnvFluidityPubkey = `FLU_SOLANA_PROGRAM_ID`

	// EnvFluidityMintPubkey is the public key of the fluid token mint
	EnvFluidityMintPubkey = `FLU_SOLANA_FLUID_MINT_PUBKEY`

	// EnvTvlDataPubkey is the public key of an initialized account for storing
	// TVL data
	EnvTvlDataPubkey = `FLU_SOLANA_TVL_DATA_PUBKEY`

	// EnvSolendPubkey is the program id of the solend program
	EnvSolendPubkey = `FLU_SOLANA_SOLEND_PROGRAM_ID`

	// EnvObligationPubkey is the public key of the solend pool obligation
	// account
	EnvObligationPubkey = `FLU_SOLANA_OBLIGATION_PUBKEY`

	// EnvReservePubkey is the public key of the solend pool reserve account
	EnvReservePubkey = `FLU_SOLANA_RESERVE_PUBKEY`

	// EnvPythPubkey is the public key of the solend pool pyth account
	EnvPythPubkey = `FLU_SOLANA_PYTH_PUBKEY`

	// EnvSwitchboardPubkey is the public key of the solend pool switchboard
	// account
	EnvSwitchboardPubkey = `FLU_SOLANA_SWITCHBOARD_PUBKEY`

	// EnvPayerPrikey is a private key of an account that holds solana funds
	// this must be the payout authority of the contract
	EnvPayerPrikey = `FLU_SOLANA_PAYER_PRIKEY`

	// EnvTokenDecimals is the number of decimals the token uses
	EnvTokenDecimals = `FLU_SOLANA_TOKEN_DECIMALS`

	// EnvTokenName is the same of the token being wrapped
	EnvTokenName = `FLU_SOLANA_TOKEN_NAME`

	// EnvTopicWinnerQueue to use when transmitting to a client the topic of
	// a winner
	EnvTopicWinnerQueue = `FLU_SOLANA_WINNER_QUEUE_NAME`
)

const (
	// Chain for filtering TRF var in Timescale
	TrfChain = `solana`

	// Network for filtering TRF var in Timescale
	TrfNetwork = `devnet`

	// SolanaBlockTime assumed by the ATX calculation
	SolanaBlockTime uint64 = 1

	// SplProgramId is the program id of the SPL token program
	SplProgramId = `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`

	// The compute used by an spl-token tranfer
	SplTranferCompute = 2721
)

func main() {

	var (
		rpcUrl           = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		payerPrikey      = util.GetEnvOrFatal(EnvPayerPrikey)
		topicWinnerQueue = util.GetEnvOrFatal(EnvTopicWinnerQueue)
		decimalPlaces_   = util.GetEnvOrFatal(EnvTokenDecimals)
		tokenName        = util.GetEnvOrFatal(EnvTokenName)

		fluidityPubkey    = pubkeyFromEnv(EnvFluidityPubkey)
		fluidMintPubkey   = pubkeyFromEnv(EnvFluidityMintPubkey)
		tvlDataPubkey     = pubkeyFromEnv(EnvTvlDataPubkey)
		solendPubkey      = pubkeyFromEnv(EnvSolendPubkey)
		obligationPubkey  = pubkeyFromEnv(EnvObligationPubkey)
		reservePubkey     = pubkeyFromEnv(EnvReservePubkey)
		pythPubkey        = pubkeyFromEnv(EnvPythPubkey)
		switchboardPubkey = pubkeyFromEnv(EnvSwitchboardPubkey)
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

	payer, err := solana.WalletFromPrivateKeyBase58(payerPrikey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer private key!"
			k.Payload = err
		})
	}

	user_actions.BufferedUserActionsSolana(func(bufferedUserActions user_actions.BufferedUserAction) {

		var (
			userActions    = bufferedUserActions.UserActions
			fluidTransfers = 0
			emission       = workerTypes.NewSolanaEmission()
		)

		// emissions in this loop should only contain information relevant to the
		// entire slot set here so that if any point the loop for the transfers
		// shorts that it'll send out with information relevant to that transfer

		emission.Network = "solana"
		emission.TokenDetails = token_details.New(tokenName, decimalPlaces)

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

		// get the entire amount of fUSDC in circulation (the amount of USDC wrapped)

		mintSupply, err := prize_pool.GetMintSupply(solanaClient, fluidMintPubkey)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get the mint supply! %v",
					err,
				)
			})
		}

		// normalise the amount to be consistent with USDC as a floating point

		entireAmountOwned := new(big.Rat).SetUint64(mintSupply)

		entireAmountOwned.Quo(entireAmountOwned, decimalPlacesRat)

		// get the value of all fluidity obligations

		tvl, err := prize_pool.GetTvl(
			solanaClient,
			fluidityPubkey,
			tvlDataPubkey,
			solendPubkey,
			obligationPubkey,
			reservePubkey,
			pythPubkey,
			switchboardPubkey,
			payer,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failedto get the TVL! %v",
					err,
				)
			})
		}

		// get the size of the pool: obligation value minus deposited value then
		// divide by 10e6 to get the actual number in
		// USDC units

		if mintSupply > tvl {
			log.Fatal(func(k *log.Log) {
				k.Format("The mint supply %#v > the TVL %#v!", mintSupply, tvl)
			})
		}

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

			defer queue.SendMessage(worker.TopicEmissions, emission)

			tribecaDataStoreTrfVars := payout.GetLatestCalculatenArgs(TrfChain, TrfNetwork)

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
		}
	})
}
