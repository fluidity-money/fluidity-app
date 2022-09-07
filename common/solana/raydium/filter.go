// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package raydium

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/fluidity"
	"github.com/fluidity-money/fluidity-app/common/solana/pyth"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	"github.com/fluidity-money/fluidity-app/common/solana/spl-token"
	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"

	"github.com/near/borsh-go"

	"github.com/btcsuite/btcutil/base58"
)

const (
	// RaydiumSwapInstructionVariant is the enum vartiant of the Raydium swap instruction
	RaydiumSwapInstructionVariant = 9

	// RaydiumSwapInstructionSize is the size a Raydium swap instruction enum
	RaydiumSwapInstructionSize = 17
)

// SwapInstruction is the instruction data of a Raydium swap transaction
type SwapInstruction struct {
	AmountIn         int64
	MinimumAmountOut int64
}

// GetRaydiumFees by taking 0.25% of the transaction value
func GetRaydiumFees(solanaClient *rpc.Provider, transaction types.TransactionResult, raydiumProgramID string, fluidTokens map[string]string) (feesPaid *big.Rat, err error) {

	var (
		transactionSignature = transaction.Transaction.Signatures[0]
		accountKeys          = transaction.Transaction.Message.AccountKeys
	)

	allInstructions := solana.GetAllInstructions(transaction)

	// raydiumFeeRat is the Raydium fee percentage (0.25%)
	raydiumFeeRat := big.NewRat(25, 10000)

	// rat to store the total fee
	feesPaid = big.NewRat(0, 1)

	for instructionNumber, instruction := range allInstructions {

		transactionProgramIsRaydium := accountKeys[instruction.ProgramIdIndex] == raydiumProgramID

		if !transactionProgramIsRaydium {

			log.Debugf(
				"instruction %v contained in %v is not a Raydium instruction",
				instructionNumber,
				transactionSignature,
			)

			continue
		}

		log.Debugf(
			"instruction %v contained in %v is a Raydium instruction",
			instructionNumber,
			transactionSignature,
		)

		instructionByteData := base58.Decode(instruction.Data)

		var (
			isRaydiumSwap          = instructionByteData[0] == RaydiumSwapInstructionVariant
			enoughInstructionBytes = len(instructionByteData) >= RaydiumSwapInstructionSize
		)

		if !isRaydiumSwap {

			log.Debugf(
				"instruction %v contained in %#v is not a Raydium swap",
				instructionNumber,
				transactionSignature,
			)

			continue
		}

		if !enoughInstructionBytes {

			log.Debugf(
				"instruction %v contained in %#v is not long enough to be a valid Raydium swap",
				instructionNumber,
				transactionSignature,
			)

			continue
		}

		log.Debugf(
			"instruction %v contained in %#v is a valid Raydium swap",
			instructionNumber,
			transactionSignature,
		)

		instructionAccounts := instruction.Accounts

		var (
			// get user source & destination accounts

			userSourceSplAccount      = accountKeys[instructionAccounts[15]]
			userDestinationSplAccount = accountKeys[instructionAccounts[16]]
		)

		// convert source and destination accounts to public key

		userSourceSplAccountPubkey, err := solana.PublicKeyFromBase58(userSourceSplAccount)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Raydium source spl-token public key from string %#v in instruction %v in %#v! %v",
				userSourceSplAccount,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		userDestinationSplAccountPubkey, err := solana.PublicKeyFromBase58(userDestinationSplAccount)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Raydium destination spl-token public key from string %#v in instruction %v in %#v! %v",
				userDestinationSplAccountPubkey,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		// get the mint and decimals of the source account

		sourceMint, err := spl_token.GetMintFromPda(
			solanaClient,
			userSourceSplAccountPubkey,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Raydium source spl-token mint %#v in instruction %v in %#v! %v",
				userSourceSplAccountPubkey,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		decimals, err := spl_token.GetDecimalsFromPda(
			solanaClient,
			userSourceSplAccountPubkey,
			"",
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Raydium source spl-token decimals %#v in instruction %v in %#v! %v",
				userSourceSplAccountPubkey,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		// get the mint of the destination account

		destinationMint, err := spl_token.GetMintFromPda(
			solanaClient,
			userDestinationSplAccountPubkey,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Raydium destination spl-token mint %#v in instruction %v in %#v! %v",
				userDestinationSplAccountPubkey,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		var (
			// check if the transaction involves a fluid token

			sourceMintIsFluid      = fluidity.IsFluidToken(sourceMint.String(), fluidTokens)
			destinationMintIsFluid = fluidity.IsFluidToken(destinationMint.String(), fluidTokens)
		)

		// if neither token is fluid we don't care about this transaction
		if !sourceMintIsFluid && !destinationMintIsFluid {

			log.Debugf(
				"no fluid tokens in Raydium swap contained in instruction %v in %#v",
				instructionNumber,
				transactionSignature,
			)

			continue
		}

		// if the source mint is a fluid token, use its non-fluid counterpart

		if sourceMintIsFluid {
			newMint, err := fluidity.GetBaseToken(sourceMint.String(), fluidTokens)

			// EnvSolanaTokenLookups is the map of fluid -> base tokens
			const EnvSolanaTokenLookups = `FLU_SOLANA_TOKEN_LOOKUPS`

			if err != nil {
				return nil, fmt.Errorf(
					"failed to convert fluid token to base token in instruction %v in %#v! %v",
					instructionNumber,
					transactionSignature,
					err,
				)
			}

			sourceMint, err = solana.PublicKeyFromBase58(newMint)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to get the mint public key from base58 %#v instruction %v in %#v: %v",
					newMint,
					instructionNumber,
					transactionSignature,
					err,
				)
			}
		}

		price, err := pyth.GetPriceByToken(solanaClient, sourceMint.String())

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get price of source token in instruction %v in %#v! %v",
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		log.Debugf(
			"got price of the source token (%v) in instruction %v in %#v: %v",
			sourceMint.String(),
			instructionNumber,
			transactionSignature,
			price,
		)

		var swapInstruction SwapInstruction

		// deserialise the transaction data minus the enum
		// variant (the first byte)

		err = borsh.Deserialize(&swapInstruction, instructionByteData[1:])

		if err != nil {
			return nil, fmt.Errorf(
				"failed to deserialise Raydium transaction data in instruction %v in %#v! %v",
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		// get the amount swapped from the instruction data
		// this is an int64

		amountIn := swapInstruction.AmountIn

		// convert the amountIn to the correct decimals

		swapAmount := spl_token.AdjustDecimals(amountIn, int(decimals))

		// normalise to USD

		swapAmount = swapAmount.Mul(swapAmount, price)

		fee := big.NewRat(0, 1)

		// remove fees
		fee = fee.Mul(swapAmount, raydiumFeeRat)

		feesPaid.Add(feesPaid, fee)
	}

	return feesPaid, nil
}
