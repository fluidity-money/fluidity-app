// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package aldrin

import (
	"bytes"
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

// AldrinSwapInstructionSize is the size of an Aldrin swap instruction enum
const AldrinSwapInstructionSize = 25

// SwapInstruction is the instruction data of a Aldrin swap transaction
type SwapInstruction struct {
	// eight bytes
	Determinant      int64
	AmountIn         int64
	MinimumAmountOut int64
	Side             int8
}

// GetAldrinFees by taking 0.25% of the transaction value
func GetAldrinFees(solanaClient *rpc.Provider, transaction types.TransactionResult, aldrinProgramID string, fluidTokens map[string]string) (feesPaid *big.Rat, err error) {

	var (
		transactionSignature = transaction.Transaction.Signatures[0]
		accountKeys          = transaction.Transaction.Message.AccountKeys
	)

	allInstructions := solana.GetAllInstructions(transaction)

	var (
		// aldrinStableFeeRat is the Aldrin fee percentage for stable swaps (0.038%)
		aldrinStableFeeRat = big.NewRat(38, 100000)
		// aldrinUnstableFeeRat is the Aldrin fee percentage for unstable swaps (0.3%)
		aldrinUnstableFeeRat = big.NewRat(3, 1000)
	)

	// AldrinSwapInstructionVariant is the enum variant of the Aldrin swap instruction
	// this is the first 8 bytes of sha256('global:swap')
	var AldrinSwapInstructionVariant = []byte{248, 198, 158, 145, 225, 117, 135, 200}

	// rat to store the total fee
	feesPaid = big.NewRat(0, 1)

	for instructionNumber, instruction := range allInstructions {

		transactionProgramIsAldrin := accountKeys[instruction.ProgramIdIndex] == aldrinProgramID

		if !transactionProgramIsAldrin {

			log.App(func(k *log.Log) {
				k.Format(
					"instruction %v contained in %v is not a Aldrin instruction",
					instructionNumber,
					transactionSignature,
				)
			})

			continue
		}

		log.Debugf(
			"instruction %v contained in %v is a Aldrin instruction",
			instructionNumber,
			transactionSignature,
		)

		instructionByteData := base58.Decode(instruction.Data)

		enoughInstructionBytes := len(instructionByteData) >= AldrinSwapInstructionSize

		if !enoughInstructionBytes {

			log.App(func(k *log.Log) {
				k.Format(
					"instruction %v contained in %#v is not long enough to be a valid Aldrin swap",
					instructionNumber,
					transactionSignature,
				)
			})

			continue
		}

		isAldrinSwap := bytes.Compare(instructionByteData[0:8], AldrinSwapInstructionVariant)

		// bytes.Compare returns 0 if slices are equal
		if isAldrinSwap != 0 {

			log.App(func(k *log.Log) {
				k.Format(
					"instruction %v contained in %#v is not a Aldrin swap",
					instructionNumber,
					transactionSignature,
				)
			})

			continue
		}

		log.Debugf(
			"instruction %v contained in %#v is a valid Aldrin swap",
			instructionNumber,
			transactionSignature,
		)

		instructionAccounts := instruction.Accounts

		var (
			// get user source & destination accounts

			userSourceSplAccount      = accountKeys[instructionAccounts[7]]
			userDestinationSplAccount = accountKeys[instructionAccounts[8]]
		)

		// convert source and destination accounts to public key

		userSourceSplAccountPubkey, err := solana.PublicKeyFromBase58(userSourceSplAccount)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Aldrin source spl-token public key from string %#v in instruction %v in %#v! %v",
				userSourceSplAccount,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		userDestinationSplAccountPubkey, err := solana.PublicKeyFromBase58(userDestinationSplAccount)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Aldrin destination spl-token public key from string %#v in instruction %v in %#v! %v",
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
				"failed to get Aldrin source spl-token mint %#v in instruction %v in %#v! %v",
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
				"failed to get Aldrin source spl-token decimals %#v in instruction %v in %#v! %v",
				sourceMint,
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
				"failed to get Aldrin destination spl-token mint %#v in instruction %v in %#v! %v",
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

			log.App(func(k *log.Log) {
				k.Format(
					"no fluid tokens in Aldrin swap contained in instruction %v in %#v",
					instructionNumber,
					transactionSignature,
				)
			})

			continue
		}

		// if the source mint is a fluid token, use its non-fluid counterpart

		if sourceMintIsFluid {
			newMint, err := fluidity.GetBaseToken(sourceMint.String(), fluidTokens)

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

		// figure out if the swap is stable or not

		numberOfBaseInstructions := len(transaction.Transaction.Message.Instructions)
		innerInstructions := transaction.Meta.InnerInstructions

		isStableSwap, err := isAldrinStableSwap(
			solanaClient,
			allInstructions,
			innerInstructions,
			instruction,
			instructionNumber,
			numberOfBaseInstructions,
			accountKeys,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to figure out if Aldrin swap was a stable swap in instruction %v in %#v! %v",
				instructionNumber,
				transactionSignature,
				err,
			)
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
				"failed to deserialise Aldrin transaction data in instruction %v in %#v! %v",
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
		if isStableSwap {
			fee = fee.Mul(swapAmount, aldrinStableFeeRat)
		} else {
			fee = fee.Mul(swapAmount, aldrinUnstableFeeRat)
		}

		feesPaid.Add(feesPaid, fee)
	}

	return feesPaid, nil
}

func isAldrinStableSwap(solanaClient *rpc.Provider, instructions []types.TransactionInstruction, innerInstructions []types.TransactionInnerInstruction, instruction types.TransactionInstruction, instructionNumber int, numBaseInstruction int, accountKeys []string) (bool, error) {

	var (
		// the inner instruction containing the Aldrin fee mintTo
		feeMintInstruction types.TransactionInstruction
		// the inner instruction containing the transfer of funds to the destination
		destinationTransferInstruction types.TransactionInstruction
	)

	if instructionNumber <= numBaseInstruction {
		// get the second and third inner instructions originating from this instruction
		innerInstruction := innerInstructions[numBaseInstruction]
		feeMintInstruction = innerInstruction.Instructions[1]
		destinationTransferInstruction = innerInstruction.Instructions[2]
	} else {
		// get the two inner instructions one after next
		feeMintInstruction = instructions[numBaseInstruction+2]
		destinationTransferInstruction = instructions[numBaseInstruction+3]
	}

	feeMintInstructionData := base58.Decode(feeMintInstruction.Data)

	var feeAmount int64

	err := borsh.Deserialize(&feeAmount, feeMintInstructionData)

	if err != nil {
		return false, fmt.Errorf(
			"failed to deserialise Aldrin fee mintTo instruction data! %v",
			err,
		)
	}

	// public key of the aldrin fee token account
	aldrinFeeTokenAccountPubkeyString := accountKeys[destinationTransferInstruction.Accounts[1]]

	aldrinFeeTokenAccountPubkey, err := solana.PublicKeyFromBase58(
		aldrinFeeTokenAccountPubkeyString,
	)

	if err != nil {
		return false, fmt.Errorf(
			"failed to get Aldrin destination spl-token public key from string %#v: %v",
			aldrinFeeTokenAccountPubkeyString,
			err,
		)
	}

	destinationDecimals, err := spl_token.GetDecimalsFromPda(
		solanaClient,
		aldrinFeeTokenAccountPubkey,
		"",
	)

	if err != nil {
		return false, fmt.Errorf(
			"failed to get Aldrin destination spl-token mint %#v! %v",
			aldrinFeeTokenAccountPubkey,
			err,
		)
	}

	destinationTransferInstructionData := base58.Decode(destinationTransferInstruction.Data)

	var destinationTransferAmount int64

	err = borsh.Deserialize(&feeAmount, destinationTransferInstructionData)

	if err != nil {
		return false, fmt.Errorf(
			"failed to deserialise Aldrin destination transfer instruction data! %v",
			err,
		)
	}

	destinationTransferAmountAdjusted := spl_token.AdjustDecimals(
		destinationTransferAmount,
		int(destinationDecimals),
	)

	feeRatio := destinationTransferAmountAdjusted.Quo(
		big.NewRat(feeAmount, 1),
		destinationTransferAmountAdjusted,
	)

	feeRatioFloat, _ := feeRatio.Float32()

	if feeRatioFloat < 15.00 {
		return true, nil
	}

	return false, nil
}
