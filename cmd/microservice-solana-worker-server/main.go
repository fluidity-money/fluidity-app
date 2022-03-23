package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/breadcrumb"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	"github.com/fluidity-money/fluidity-app/common/solana/solend"

	prizePool "github.com/fluidity-money/fluidity-app/cmd/microservice-solana-prize-pool/lib/solana"

	solana "github.com/gagliardetto/solana-go"
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

	// EnvTopicWinnerQueue to use when transmitting to a client the topic of
	// a winner
	EnvTopicWinnerQueue = `FLU_SOLANA_WINNER_QUEUE_NAME`
)

const (
	// SolanaBlockTime assumed by the ATX calculation
	SolanaBlockTime uint64 = 1

	// SplProgramId is the program id of the SPL token program
	SplProgramId = `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`

	// UsdcDecimalPlaces to use when normalising any values from USDC
	UsdcDecimalPlaces = 1e6
)

func main() {

	var (
		rpcUrl           = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		payerPrikey      = util.GetEnvOrFatal(EnvPayerPrikey)
		topicWinnerQueue = util.GetEnvOrFatal(EnvTopicWinnerQueue)

		fluidityPubkey    = pubkeyFromEnv(EnvFluidityPubkey)
		fluidMintPubkey   = pubkeyFromEnv(EnvFluidityMintPubkey)
		tvlDataPubkey     = pubkeyFromEnv(EnvTvlDataPubkey)
		solendPubkey      = pubkeyFromEnv(EnvSolendPubkey)
		obligationPubkey  = pubkeyFromEnv(EnvObligationPubkey)
		reservePubkey     = pubkeyFromEnv(EnvReservePubkey)
		pythPubkey        = pubkeyFromEnv(EnvPythPubkey)
		switchboardPubkey = pubkeyFromEnv(EnvSwitchboardPubkey)
	)

	var (
		decimalPlacesRat     = big.NewRat(UsdcDecimalPlaces, 1)
		usdcDecimalPlacesRat = big.NewRat(UsdcDecimalPlaces, 1)
	)

	solanaClient := solanaRpc.New(rpcUrl)

	payer, err := solana.WalletFromPrivateKeyBase58(payerPrikey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer private key!"
			k.Payload = err
		})
	}

	crumb := breadcrumb.NewBreadcrumb()

	user_actions.BufferedUserActionsSolana(func(bufferedUserActions user_actions.BufferedUserAction) {

		var (
			userActions    = bufferedUserActions.UserActions
			fluidTransfers = 0
		)

		for _, userAction := range userActions {
			if userAction.Type == "send" {
				fluidTransfers++
			}
		}

		atx := probability.CalculateAtx(SolanaBlockTime, fluidTransfers)

		apy, err := solend.GetUsdApy(solanaClient, reservePubkey)

		crumb.Set(func(k *breadcrumb.Breadcrumb) {
			k.Many(map[string]interface{}{
				"solend supply apy": apy.FloatString(10),
			})
		})

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get USDC apy on Solana!"
				k.Payload = err
			})
		}

		bpy := probability.CalculateBpy(SolanaBlockTime, apy, crumb)

		// get the entire amount of fUSDC in circulation (the amount of USDC wrapped)

		mintSupply := prizePool.GetMintSupply(rpcUrl, fluidMintPubkey)

		// normalise the amount to be consistent with USDC as a floating point

		entireAmountOwned := new(big.Rat).SetUint64(mintSupply)

		entireAmountOwned.Quo(entireAmountOwned, usdcDecimalPlacesRat)

		// get the value of all fluidity obligations

		tvl := prizePool.GetTvl(
			rpcUrl,
			fluidityPubkey,
			tvlDataPubkey,
			solendPubkey,
			obligationPubkey,
			reservePubkey,
			pythPubkey,
			switchboardPubkey,
			payer,
		)

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

		sizeOfThePool.Quo(sizeOfThePool, usdcDecimalPlacesRat)

		bpyStakedUsd := probability.CalculateBpyStakedUnderlyingAsset(
			bpy,
			entireAmountOwned,
		)

		for _, userAction := range userActions {

			// skip if it's not a send

			var (
				userActionTransactionHash  = userAction.TransactionHash
				userActionSenderAddress    = userAction.SenderAddress
				userActionRecipientAddress = userAction.RecipientAddress
			)

			if userAction.Type != "send" {
				continue
			}

			defer breadcrumb.SendAndClear(crumb)

			solanaTransactionFeesNormalised := userAction.AdjustedFee

			randomN, randomPayouts := probability.WinningChances(
				solanaTransactionFeesNormalised,
				atx,
				bpyStakedUsd,
				sizeOfThePool,
				decimalPlacesRat,
				fluidTransfers,
				SolanaBlockTime,
				crumb,
			)

			randomIntegers := generateRandomIntegers(
				probability.WinningClasses,
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
				crumb,
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
			}

			queue.SendMessage(topicWinnerQueue, winnerAnnouncement)
		}
	})
}
