package main

import (
	"context"
	"math/big"
	"os"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/breadcrumb"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	"github.com/fluidity-money/fluidity-app/common/solana/fluidity"
	"github.com/fluidity-money/fluidity-app/common/solana/solend"

	prizePool "github.com/fluidity-money/fluidity-app/cmd/microservice-solana-prize-pool/lib/solana"

	solana "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvUpdateInterval is the interval between each prize pool update
	EnvUpdateInterval = `FLU_SOLANA_PRIZE_POOL_UPDATE_TIME`

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

	// EnvSolPythPubkey is the public key of the pyth price account for SOL
	EnvSolPythPubkey = `FLU_SOLANA_SOL_PYTH_PUBKEY`

	// EnvPayerPrikey is a private key of an account that holds solana funds
	// this must be the payout authority of the contract
	EnvPayerPrikey = `FLU_SOLANA_PAYER_PRIKEY`

	// EnvPDAPubkey is the public key of the program derived account of the
	// fluidity contract
	EnvPDAPubkey = `FLU_SOLANA_PDA_PUBKEY`

	// EnvDebugFakePayouts is a boolean that if true, logs payout instead of
	// submitting them to solana
	EnvDebugFakePayouts = `FLU_DEBUG_FAKE_PAYOUTS`
)

const (
	// SolanaBlockTime assumed by the ATX calculation
	SolanaBlockTime uint64 = 1

	// SplProgramId is the program id of the SPL token program
	SplProgramId = `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`

	// UsdcDecimalPlaces to use when normalising any values from USDC
	UsdcDecimalPlaces = 1e6

	// TokenName that's wrapped by the codebase
	TokenName = "USDC"

	// BumpSeed to signing the contract calls within the contract with the PDA
	BumpSeed = 251
)

func main() {

	var (
		rpcUrl = util.GetEnvOrFatal(EnvSolanaRpcUrl)

		fluidityPubkey    = pubkeyFromEnv(EnvFluidityPubkey)
		fluidMintPubkey   = pubkeyFromEnv(EnvFluidityMintPubkey)
		tvlDataPubkey     = pubkeyFromEnv(EnvTvlDataPubkey)
		solendPubkey      = pubkeyFromEnv(EnvSolendPubkey)
		obligationPubkey  = pubkeyFromEnv(EnvObligationPubkey)
		reservePubkey     = pubkeyFromEnv(EnvReservePubkey)
		pythPubkey        = pubkeyFromEnv(EnvPythPubkey)
		switchboardPubkey = pubkeyFromEnv(EnvSwitchboardPubkey)
		payerPrikey       = util.GetEnvOrFatal(EnvPayerPrikey)
		PDAPubkey         = pubkeyFromEnv(EnvPDAPubkey)
		splPubkey         = solana.MustPublicKeyFromBase58(SplProgramId)

		debugFakePayouts   = os.Getenv(EnvDebugFakePayouts) == "true"
	)

	var (
		decimalPlacesRat       = big.NewRat(UsdcDecimalPlaces, 1)
		usdcDecimalPlacesRat   = big.NewRat(UsdcDecimalPlaces, 1)
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

		// recentBlockHash is only set if a winner is found so a hash request is
		// made, but not if there's no winner in the block. only set inside the
		// user actions loop.

		var recentBlockHash solana.Hash

		for _, userAction := range userActions {
			// skip if it's not a send

			if userAction.Type != "send" {
				return
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
				return
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

			// don't bother paying out if the unlucky winner won nothing

			if winningAmount <= 0 {
				return
			}

			// since there was a winner, it's time to set the block hash if it's not
			// set already.

			if recentBlockHash.IsZero() {

				recentBlockHashResult, err := solanaClient.GetRecentBlockhash(
					context.Background(),
					solanaRpc.CommitmentFinalized,
				)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Message = "Failed to get a recent Solana blockhash!"
						k.Payload = err
					})
				}

				recentBlockHash = recentBlockHashResult.Value.Blockhash
			}

			// call the payout function!

			var (
				aPubkey = solana.MustPublicKeyFromBase58(userAction.SenderAddress)
				bPubkey = solana.MustPublicKeyFromBase58(userAction.RecipientAddress)
			)

			var (
				// solanaAccountMetaSpl is used to know where to send transactions
				solanaAccountMetaSpl = solana.NewAccountMeta(splPubkey, false, false)

				// solanaAccountFluidMint is needed to be writable and used as a mint,
				// tracking the amounts of Fluid tokens that the account has. is set to true
				// to indicate mutability
				solanaAccountFluidMint = solana.NewAccountMeta(fluidMintPubkey, true, false)

				// solanaAccountPDA is used as an authority to sign off on minting
				// by the payout function
				solanaAccountPDA = solana.NewAccountMeta(PDAPubkey, false, false)

				// solanaAccountObligation to use to track the amount of Solend
				// obligations that Fluidity owns to pass the account to do a calculation for
				// the prize pool
				solanaAccountObligation = solana.NewAccountMeta(
					obligationPubkey,
					false,
					false,
				)

				// solanaAccountReserve to use to track the exchange rate of obligation
				// collateral
				solanaAccountReserve = solana.NewAccountMeta(
					reservePubkey,
					false,
					false,
				)

				// accounts used to indicate the payout recipients from the reward function.
				// both accounts are mutable to support sending to the token accounts

				solanaAccountA = solana.NewAccountMeta(aPubkey, true, false)
				solanaAccountB = solana.NewAccountMeta(bPubkey, true, false)

				// solanaAccountPayer, with true set to sign amounts paid out to the
				// recipients, strictly the fluidity authority
				solanaAccountPayer = solana.NewAccountMeta(
					payer.PublicKey(),
					true,
					true,
				)
			)

			accountMetas := solana.AccountMetaSlice{
				solanaAccountMetaSpl,
				solanaAccountFluidMint,
				solanaAccountPDA,
				solanaAccountObligation,
				solanaAccountReserve,
				solanaAccountA,
				solanaAccountB,
				solanaAccountPayer,
			}

			payoutInstruction := fluidity.InstructionPayout{
				fluidity.VariantPayout,
				winningAmount,
				TokenName,
				BumpSeed,
			}

			// if flag is set, print debug information and don't actually send payout
			if debugFakePayouts {
				log.Debug(func(k *log.Log) {
					k.Format(
						`Payout would have been sent with account metas:
{SPL program: %v, fluid mint: %v, PDA: %v, obligation: %v, reserve: %v, account A: %v, account B: %v, payer: %v}
and instruction data %+v`,
						splPubkey,
						fluidMintPubkey,
						PDAPubkey,
						obligationPubkey,
						reservePubkey,
						aPubkey,
						bPubkey,
						payer.PublicKey(),
						payoutInstruction,
					)
				})
				return
			}

			payoutInstructionBytes, err := borsh.Serialize(payoutInstruction)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to serialize payout instruction data!"
					k.Payload = err
				})
			}

			instruction := solana.NewInstruction(
				fluidityPubkey,
				accountMetas,
				payoutInstructionBytes,
			)

			instructions := []solana.Instruction{instruction}

			transaction, err := solana.NewTransaction(instructions, recentBlockHash)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to construct payout transaction!"
					k.Payload = err
				})
			}

			_, err = transaction.Sign(func(key solana.PublicKey) *solana.PrivateKey {

				if payer.PublicKey().Equals(key) {
					return &payer.PrivateKey
				}

				return nil
			})

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to sign transaction!"
					k.Payload = err
				})
			}

			sig, err := solanaClient.SendTransaction(context.Background(), transaction)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to send payout transaction!"
					k.Payload = err
				})
			}

			log.App(func(k *log.Log) {
				k.Format("Sent payout transaction with signature %v", sig)
			})
		}
	})
}
