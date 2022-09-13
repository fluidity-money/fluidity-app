// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package orca

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

	"github.com/btcsuite/btcutil/base58"
	"github.com/near/borsh-go"
)

const (
	// CurveDataStartByte is the offset at which the curve data is stored
	CurveDataStartByte = 227

	// SplMintDecimalsStartByte is the offset at which the decimals of an
	// spl-mint is encoded
	SplMintDecimalsStartByte = 44

	// SwapVariant is the enum variant of swap instruction
	SwapVariant = 1
)

// ConstantProductCurveFeeData is an Orca struct that
// encodes the % fee taken on a pool
type ConstantProductCurveFeeData struct {
	TradeFeeNumerator        int64
	TradeFeeDenominator      int64
	OwnerTradeFeeNumerator   int64
	OwnerTradeFeeDenominator int64
}

// GetOrcaFees by checking that an orca swap occurred, then
// destructuring the swap information to get the fee %, and
// getting the fees paid by multiplying the value of the swap
func GetOrcaFees(solanaClient *rpc.Provider, transaction types.TransactionResult, orcaProgramId string, fluidTokens map[string]string) (feesPaid *big.Rat, err error) {

	var (
		transactionSignature = transaction.Transaction.Signatures[0]
		accountKeys          = transaction.Transaction.Message.AccountKeys
	)

	feesPaid = big.NewRat(0, 1)

	allInstructions := solana.GetAllInstructions(transaction)

	wrappedSolAccounts := make(map[string]bool)

	for instructionNumber, instruction := range allInstructions {
		var (
			splProgramId = spl_token.TokenProgramAddress

			programId                = accountKeys[instruction.ProgramIdIndex]
			transactionProgramIsSpl  = programId == splProgramId
			transactionProgramIsOrca = programId == orcaProgramId

			instructionData = instruction.Data
			accounts = instruction.Accounts
		)

		if transactionProgramIsSpl {
			isInitialise, err := spl_token.IsInitialiseAccount(instructionData)

			if err != nil {
			    return nil, fmt.Errorf(
					"Failed to decode an spl instruction! %w",
					err,
				)
			}

			if isInitialise {
				var (
					initialisedAccount = accountKeys[accounts[0]]
					mint = accountKeys[accounts[1]]
				)
				accountIsWrappedSol := mint == spl_token.WrappedSolMintAddress

				wrappedSolAccounts[initialisedAccount] = accountIsWrappedSol
			}
		}

		if !transactionProgramIsOrca {

			log.Debugf(
				"instruction %v contained in %#v is not an Orca instruction",
				instructionNumber,
				transactionSignature,
			)

			continue
		}

		log.Debugf(
			"instruction %v contained in %#v is an Orca instruction",
			instructionNumber,
			transactionSignature,
		)

		// make sure it's a swap instruction
		inputBytes := base58.Decode(instructionData)

		isOrcaSwap := inputBytes[0] == SwapVariant

		if !isOrcaSwap {

			log.Debugf(
				"instruction %v contained in %#v is not an Orca swap",
				instructionNumber,
				transactionSignature,
			)

			continue
		}

		log.Debugf(
			"instruction %v contained in %#v is an Orca swap",
			instructionNumber,
			transactionSignature,
		)

		var (
			// swapAccount is the curve data account for this pool

			swapAccount = accountKeys[accounts[0]]

			// get user source & destination accounts

			userSourceSplAccount      = accountKeys[accounts[3]]
			userDestinationSplAccount = accountKeys[accounts[6]]
		)

		swapAccountPubkey, err := solana.PublicKeyFromBase58(swapAccount)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get public key from string %#v in instruction %v in %#v! %v",
				swapAccount,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		resp, err := solanaClient.GetAccountInfo(swapAccountPubkey)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Orca swap data account in instruction %v in %#v! %v",
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		var feeData ConstantProductCurveFeeData

		data, err := resp.GetBinary()

		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert the data account from base64: %v",
				err,
			)
		}

		// make sure the data is long enough to encode the fee data

		if len(data) < CurveDataStartByte+32 {
			log.Debugf(
				"Orca fee data doesn't contain enough bytes in instruction %v in %#v!",
				instructionNumber,
				transactionSignature,
			)

			continue
		}

		err = borsh.Deserialize(&feeData, data[CurveDataStartByte:])

		if err != nil {
			return nil, fmt.Errorf(
				"error deserialising Orca fee data in instruction %v in %#v! %v",
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		// calculate the fee percentages

		tradeFee := big.NewRat(
			feeData.TradeFeeNumerator,
			feeData.TradeFeeDenominator,
		)

		ownerTradeFee := safeNewRat(
			feeData.OwnerTradeFeeNumerator,
			feeData.OwnerTradeFeeDenominator,
		)

		// convert source and destination accounts to public key

		userSourceSplAccountPubkey, err := solana.PublicKeyFromBase58(
			userSourceSplAccount,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Orca source spl-token public key from string %#v in instruction %v in %#v! %v",
				userSourceSplAccount,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		userDestinationSplAccountPubkey, err := solana.PublicKeyFromBase58(userDestinationSplAccount)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Orca destination spl-token public key from string %#v in instruction %v in %#v! %v",
				userDestinationSplAccount,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		// get the mint and decimals of the source account

		var (
			sourceMint solana.PublicKey
			decimals uint8
		)

		if wrappedSolAccounts[userSourceSplAccount] {
			// don't do a lookup if we think this is a wrapped sol account
			// since orca loves to create ephemeral wsol accounts that
			// won't exist when we do the lookup
			sourceMint = spl_token.WrappedSolMintAddressPubkey
			decimals = spl_token.WrappedSolDecimals

		} else {
			sourceMint, err = spl_token.GetMintFromPda(
				solanaClient,
				userSourceSplAccountPubkey,
			)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to get Orca source spl-token mint %#v in instruction %v in %#v! %v",
					userSourceSplAccountPubkey,
					instructionNumber,
					transactionSignature,
					err,
				)
			}

			decimals, err = spl_token.GetDecimalsFromPda(
				solanaClient,
				userSourceSplAccountPubkey,
				"",
			)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to get Orca source spl-token decimals %#v in instruction %v in %#v! %v",
					userSourceSplAccountPubkey,
					instructionNumber,
					transactionSignature,
					err,
				)
			}
		}

		// get the mint of the destination account

		var destinationMint solana.PublicKey

		if wrappedSolAccounts[userDestinationSplAccount] {
			destinationMint = spl_token.TokenAssociatedProgramAddressPubkey

		} else {
			destinationMint, err = spl_token.GetMintFromPda(
				solanaClient,
				userDestinationSplAccountPubkey,
			)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to get Orca destination spl-token mint %#v in instruction %v in %#v! %v",
					userDestinationSplAccountPubkey,
					instructionNumber,
					transactionSignature,
					err,
				)
			}
		}

		var (
			// check if the transaction involves a fluid token

			sourceMintIsFluid = fluidity.IsFluidToken(
				sourceMint.String(),
				fluidTokens,
			)

			destinationMintIsFluid = fluidity.IsFluidToken(
				destinationMint.String(),
				fluidTokens,
			)
		)

		// if neither token is fluid we don't care about this transaction

		if !sourceMintIsFluid && !destinationMintIsFluid {

			log.Debugf(
				"no fluid tokens in Orca swap contained in instruction %v in %#v",
				instructionNumber,
				transactionSignature,
			)

			continue
		}

		// if the source mint is a fluid token, use its non-fluid counterpart

		if sourceMintIsFluid {
			newMint, err := fluidity.GetBaseToken(
				sourceMint.String(),
				fluidTokens,
			)

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

		price, err := pyth.GetPriceByToken(
			solanaClient,
			sourceMint.String(),
		)

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

		// amountIn is the amount swapped
		// int64 (8 bytes) after the first byte

		amountInBytes := inputBytes[1:9]

		var amountIn int64

		err = borsh.Deserialize(&amountIn, amountInBytes)

		if err != nil {
			return nil, fmt.Errorf(
				"issue deserialising Orca swap amountIn in instruction %v in %#v! %v",
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		fee := big.NewRat(0, 1)

		// adjust the value to the correct decimals (uint8) from the chain

		swapAmount := spl_token.AdjustDecimals(amountIn, int(decimals))

		// adjust to USDC value

		swapAmount = swapAmount.Mul(swapAmount, price)

		// remove fees

		fee = fee.Mul(swapAmount, tradeFee)
		fee = fee.Add(fee, new(big.Rat).Mul(swapAmount, ownerTradeFee))

		feesPaid.Add(feesPaid, fee)
	}

	return feesPaid, nil
}
