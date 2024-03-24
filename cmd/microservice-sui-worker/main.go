// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"
	"math"
	"math/big"
	"strconv"

	"github.com/fluidity-money/sui-go-sdk/signer"
	suiSdk "github.com/fluidity-money/sui-go-sdk/sui"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	suiApps "github.com/fluidity-money/fluidity-app/common/sui/applications"
	prize_pool "github.com/fluidity-money/fluidity-app/common/sui/applications/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	sui_queue "github.com/fluidity-money/fluidity-app/lib/queues/sui"
	user_actions "github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/sui"
	worker_types "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvUnderlyingTokenName is the name of the underlying token (e.g. USDC)
	EnvUnderlyingTokenName = `FLU_SUI_UNDERLYING_TOKEN_NAME`

	// EnvTokenDecimals is the number of decimals the token uses
	EnvTokenDecimals = `FLU_SUI_TOKEN_DECIMALS`

	// EnvUnderlyingPackageId for the package ID of the underlying token
	EnvUnderlyingPackageId = `FLU_SUI_UNDERLYING_PACKAGE_ID`

	// EnvFluidPackageId for the package ID of the fluid token
	EnvFluidPackageId = `FLU_SUI_FLUID_PACKAGE_ID`

	// EnvUtilityContracts to list the utility contracts to monitor and tag transactions
	EnvUtilityContracts = `FLU_SUI_UTILITY_CONTRACTS`

	// EnvWorkerMnemonic for the private mnemonic to use to derive the worker keys
	EnvWorkerMnemonic = `FLU_SUI_WORKER_MNEMONIC`

	// EnvSuiHttpUrl is the url to use to connect to the HTTP sui endpoint
	EnvSuiHttpUrl = `FLU_SUI_HTTP_URL`

	// EnvPrizePoolVaultId for the Object ID of the prize pool vault
	EnvPrizePoolVaultId = `FLU_SUI_PRIZE_POOL_VAULT_ID`

	// EnvScallopVersion for the version of the scallop market to use
	EnvScallopVersion = `FLU_SUI_SCALLOP_VERSION`

	// EnvScallopMarket for the address of the scallop market to use
	EnvScallopMarket = `FLU_SUI_SCALLOP_MARKET`

	// EnvCoinReserve for the coin reserve containing the fluid token
	EnvCoinReserve = `FLU_SUI_COIN_RESERVE`

	// SuiClockId for the constant address of the Sui clock
	SuiClockId = `0x0000000000000000000000000000000000000000000000000000000000000006`
)

func main() {
	var (
		utilities      = suiApps.UtilityListFromEnv(EnvUtilityContracts)
		baseTokenName  = util.GetEnvOrFatal(EnvUnderlyingTokenName)
		decimalPlaces_ = util.GetEnvOrFatal(EnvTokenDecimals)
		suiHttpUrl     = util.PickEnvOrFatal(EnvSuiHttpUrl)
		workerMnemonic = util.GetEnvOrFatal(EnvWorkerMnemonic)

		underlyingPackageId = util.GetEnvOrFatal(EnvUnderlyingPackageId)
		fluidPackageId      = util.GetEnvOrFatal(EnvFluidPackageId)
		coinReserve         = util.GetEnvOrFatal(EnvCoinReserve)

		prizePoolVault = util.GetEnvOrFatal(EnvPrizePoolVaultId)
		scallopVersion = util.GetEnvOrFatal(EnvScallopVersion)
		scallopMarket  = util.GetEnvOrFatal(EnvScallopMarket)
	)

	payoutArgs := payoutArgs{
		PrizePoolVault: prizePoolVault,
		ScallopVersion: scallopVersion,
		ScallopMarket:  scallopMarket,
		Clock:          SuiClockId,
	}

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

	signer, err := signer.NewSignertWithMnemonic(workerMnemonic)
	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create a signer from a mnemnoic string!"
			k.Payload = err
		})
	}
	workerAddress := signer.Address

	client := suiSdk.NewSuiClient(suiHttpUrl)

	decimalsAdjusted := math.Pow10(decimalPlaces)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fluidToken := sui.SuiToken{
		TokenShortName: baseTokenName,
		TokenDecimals:  decimalPlaces,
		PackageId:      fluidPackageId,
		IsFluid:        true,
	}

	baseToken := sui.SuiToken{
		TokenShortName: baseTokenName,
		TokenDecimals:  decimalPlaces,
		PackageId:      underlyingPackageId,
		IsFluid:        false,
	}

	sui_queue.DecoratedTransfers(func(decoratedTransfers []sui_queue.DecoratedTransfer) {
		transfersWithFees := make([]worker_types.TransferWithFee, 0)

		for _, transfer := range decoratedTransfers {
			var (
				event      = transfer.Event
				checkpoint = transfer.Checkpoint
				userAction = transfer.UserAction

				transactionDigest = userAction.TransactionHash
				application_      = userAction.Application
				transactionHash   = userAction.TransactionHash
				logIndex          = userAction.LogIndex
				tokenDetails      = userAction.TokenDetails

				packageId = event.PackageId

				gasFee = userAction.AdjustedFee
			)

			if tokenDetails.TokenShortName != baseTokenName {
				continue
			}

			application, err := suiApps.ParseApplicationName(application_)
			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Unable to parse Sui application name %v in transaction %v",
						application_,
						transactionDigest,
					)
					k.Payload = err
				})
			}

			// process app (set fee and application in user action)
			// AppData is not yet used on Sui
			feeData, _, emission, err := suiApps.GetApplicationFee(transfer, *event, *application)

			var utility applications.UtilityName
			utilityDetails, ok := utilities[packageId]
			if ok {
				utility = utilityDetails.Utility
			} else {
				utility = applications.UtilityFluid
			}

			var (
				fee    = feeData.Fee
				volume = feeData.Volume
				// application will be set by sui-user-actions
			)

			decorator := &worker_types.SuiWorkerDecorator{
				SuiAppFees:     emission,
				UtilityName:    utility,
				ApplicationFee: fee,
				Volume:         volume,
			}

			transferWithFee := worker_types.TransferWithFee{
				UserAction: userAction,
				Event:      event,
				Checkpoint: checkpoint,
				Decorator:  decorator,
			}

			transfersWithFees = append(transfersWithFees, transferWithFee)

			// we set the decorator and if there's an app fee
			// if this is a non-application transfer, it has already been tracked as a user action
			if fee == nil {
				log.App(func(k *log.Log) {
					k.Format(
						"Skipping an application transfer for transaction %#v and application %#v!",
						transactionDigest,
						application,
					)
				})

				continue
			}

			sender, recipient, err := suiApps.GetApplicationTransferParties(
				transfer,
				*application,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to get the sender and receiver for an application transfer with hash %s!",
						transactionHash,
					)

					k.Payload = err
				})
			}
			indexCopy := new(misc.BigInt)
			indexCopy.Set(&logIndex.Int)

			// adjust volume then convert to a big int
			// no loss of precision as there won't be more decimals than tokenDecimals
			volume = volume.Mul(volume, decimalsRat)
			volumeAdjusted_, _ := new(big.Int).SetString(volume.FloatString(0), 0)
			volumeAdjusted := misc.NewBigIntFromInt(*volumeAdjusted_)

			suiTransactionFeesNormalised := gasFee

			if *application != suiApps.ApplicationNone {
				suiTransactionFeesNormalised.Add(
					suiTransactionFeesNormalised,
					fee,
				)
			}

			transferUserAction := user_actions.NewSendSui(
				network.NetworkSui,
				sender,
				recipient,
				transactionHash,
				volumeAdjusted,
				*indexCopy,
				suiTransactionFeesNormalised,
				&application_,
				baseTokenName,
				decimalPlaces,
			)

			queue.SendMessage(
				user_actions.TopicUserActionsSui,
				transferUserAction,
			)
		}

		var (
			fluidTransfers = 0
			tokenDetails   = baseToken.TokenDetails()
			emission       = worker_types.NewSuiEmission()
		)

		workerConfig := worker.GetWorkerConfigSui()

		suiBlockTime := workerConfig.SuiBlockTime

		suiBlockTimeRat := new(big.Rat).SetUint64(suiBlockTime)

		// emissions in this loop should only contain information relevant to the
		// entire slot set here so that if any point the loop for the transfers
		// shorts that it'll send out with information relevant to that transfer

		emission.Network = "sui"
		emission.TokenDetails = tokenDetails

		pendingWinners := make([]spooler.PendingWinner, 0)

		for _, transfer := range transfersWithFees {
			userAction := transfer.UserAction

			isSameToken := userAction.TokenDetails.TokenShortName == baseTokenName

			if isSameToken {
				fluidTransfers++
			}
		}

		atx := probability.CalculateAtx(suiBlockTimeRat, fluidTransfers)

		// get the size of the pool: obligation value minus deposited value then
		// divide by 10e6 to get the actual number in
		// USDC units

		mintSupply, err := prize_pool.GetMintSupply(client, fluidToken.Type())
		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to fetch mint supply of fluid token %v",
					fluidToken.Type(),
				)
				k.Payload = err
			})
		}

		tvl, err := prize_pool.GetVaultBalance(client, coinReserve)
		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to fetch TVL of fluid token %v",
					fluidToken.Type(),
				)
				k.Payload = err
			})
		}

		// check initial supply is less than TVL so there is
		// an available prize pool

		if mintSupply > tvl {
			log.Fatal(func(k *log.Log) {
				k.Message = "Prize pool busted potentially!"

				k.Payload = fmt.Errorf(
					"mint supply %v > tvl %v",
					mintSupply,
					tvl,
				)
			})
		}

		unscaledPool := tvl - mintSupply

		unscaledPoolRat := new(big.Rat).SetUint64(unscaledPool)

		log.Debug(func(k *log.Log) {
			k.Message = "Unscaled reward pool size"
			k.Payload = unscaledPool
		})

		for _, transfer := range transfersWithFees {
			var (
				userAction                 = transfer.UserAction
				userActionCheckpointNumber = transfer.Checkpoint.Int64()
				userActionAppEmission      = transfer.Decorator.SuiAppFees

				tokenDetails               = userAction.TokenDetails
				adjustedFee                = userAction.AdjustedFee
				userActionTransactionHash  = userAction.TransactionHash
				userActionSenderAddress    = userAction.SenderAddress
				userActionRecipientAddress = userAction.RecipientAddress
				application                = userAction.Application
			)

			// skip if it's not a send, or the wrong token
			if tokenDetails.TokenShortName != baseTokenName {
				continue
			}

			// send emissions out that can be actioned on when the loop ends

			emission.TransactionHash = userActionTransactionHash
			emission.RecipientAddress = userActionRecipientAddress
			emission.SenderAddress = userActionSenderAddress

			emission.SuiAppFees = userActionAppEmission

			checkpointNumber_ := misc.BigIntFromInt64(userActionCheckpointNumber)
			emission.SuiCheckpointNumber = checkpointNumber_

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

			// TODO fetch and payout special pools (util mining)
			pools := []worker_types.UtilityVars{
				{
					Name:               applications.UtilityFluid,
					PoolSizeNative:     unscaledPoolRat,
					TokenDecimalsScale: decimalsRat,
					ExchangeRate:       big.NewRat(1, 1),
					DeltaWeight:        deltaWeight,
				},
			}

			emissionScaledRewardPool := new(big.Rat).Quo(
				unscaledPoolRat,
				decimalsRat,
			)

			emission.Payout.RewardPool, _ = emissionScaledRewardPool.Float64()

			randomN, randomPayouts, _ := probability.WinningChances(
				worker_types.TrfModeNormal,
				adjustedFee,
				atx,
				payoutFreq,
				pools,
				winningClasses,
				fluidTransfers,
				suiBlockTime,
				emission,
			)

			randomSource := util.RandomIntegers(
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

			fromWinAmounts, toWinAmounts := probability.CalculatePayoutsSplit(randomPayouts, matchedBalls)

			log.App(func(k *log.Log) {
				k.Format(
					"Transaction hash %#v with transaction from %#v to %#v and application %v has won: %#v won %s,%#v won %s",
					userActionTransactionHash,
					userActionSenderAddress,
					userActionRecipientAddress,
					application,
					userActionSenderAddress,
					formatPayouts(fromWinAmounts),
					userActionRecipientAddress,
					formatPayouts(toWinAmounts),
				)
			})

			fromPayout, existsFrom := fromWinAmounts[applications.UtilityFluid]
			toPayout, existsTo := toWinAmounts[applications.UtilityFluid]

			if !(existsFrom || existsTo) {
				log.Fatal(func(k *log.Log) {
					k.Message = "No payout for the fluid token found!"
					k.Payload = randomPayouts
				})
			}

			if !fromPayout.Native.IsUint64() {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Winning amount %s is too large to be represented as a u64!",
						fromPayout.Native.String(),
					)
				})
			}

			if !toPayout.Native.IsUint64() {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Winning amount %s is too large to be represented as a u64!",
						toPayout.Native.String(),
					)
				})
			}

			winningAmount := fromPayout.Native.Uint64()

			// don't bother paying out if the unlucky winner won nothing

			if winningAmount <= 0 {
				sendEmission(emission)
				continue
			}

			sendEmission(emission)

			pendingWinners_ := spooler.CreatePendingWinnersSui(transfer, fromWinAmounts, toWinAmounts, utilities, matchedBalls)
			// store pending winners from all announcements to store later
			pendingWinners = append(pendingWinners, pendingWinners_...)
		}
		spooler.InsertPendingWinners(pendingWinners)
		payoutSpooledWinnings(client, *signer, fluidToken, baseToken, workerAddress, payoutArgs, pendingWinners)
	})
}
