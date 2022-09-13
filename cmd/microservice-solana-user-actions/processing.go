// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"errors"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/solana"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	"github.com/fluidity-money/fluidity-app/common/solana/fluidity"
	spl_token "github.com/fluidity-money/fluidity-app/common/solana/spl-token"
)

var (
	// Winner1Split, 8 that's used to fix the sender amount portion
	Winner1Split = big.NewInt(8)

	// Winner2Split, 2 that's used to fix the recipient amount
	Winner2Split = big.NewInt(2)

	// winner10Split that's finally used to get the 80/20 split for winners
	winner10Split = big.NewInt(10)

	blockPayoutPrefix = "Large payout blocked! Token mint "
)

func tokenIsMintEvent(senderAddress, recipientAddress, fluidityTokenMintAddress, fluidityPdaPubkey string) bool {
	switch true {

	// if this is true, then this must be a mint
	case senderAddress == fluidityTokenMintAddress:
		fallthrough

	// if this is true, then this must be a burn
	case recipientAddress == fluidityTokenMintAddress:
		fallthrough

	case senderAddress == fluidityPdaPubkey:
		fallthrough

	case recipientAddress == fluidityPdaPubkey:
		return true
	}

	return false
}

func processFluidityTransaction(transactionHash string, instruction solana.TransactionInstruction, accounts, fluidityOwners []string, tokenDetails token_details.TokenDetails) (winner1 *winners.Winner, winner2 *winners.Winner, swapWrap *user_actions.UserAction, swapUnwrap *user_actions.UserAction, err error) {

	fluidityTransaction, err := fluidity.DecodeFluidityInstruction(instruction.Data)

	if err != nil {
		return nil, nil, nil, nil, fmt.Errorf(
			"failed to decode Fluidity Solana transaction data! %#v %v",
			instruction.Data,
			err,
		)
	}

	currentTime := time.Now()

	if fluidityTransaction.Payout != nil {
		var (
			winnerAIndex = instruction.Accounts[5]
			winnerBIndex = instruction.Accounts[6]
		)

		// payout for different token
		if fluidityOwners[winnerAIndex] == "" {
			log.App(func(k *log.Log) {
				k.Format(
					"Got a winning payout, but token mint was wrong! %v",
					transactionHash,
				)
			})
			return nil, nil, nil, nil, nil
		}

		transactionPayoutValue := fluidityTransaction.Payout.Value

		winner_ := winners.Winner{
			Network:         network.NetworkSolana,
			TransactionHash: transactionHash,
			AwardedTime:     currentTime,
			TokenDetails:    tokenDetails,
		}

		winningAmount := new(big.Int).SetUint64(transactionPayoutValue)

		var (
			winner1_ = winner_
			winner2_ = winner_
		)

		winningAmount1 := new(big.Int).Mul(winningAmount, Winner1Split)

		winningAmount1.Quo(winningAmount1, winner10Split)

		winningAmount2 := new(big.Int).Mul(winningAmount, Winner2Split)

		winningAmount2.Quo(winningAmount2, winner10Split)

		winner1_.WinnerAddress = accounts[winnerAIndex]
		winner1_.SolanaWinnerOwnerAddress = fluidityOwners[winnerAIndex]

		winner1_.WinningAmount = misc.NewBigInt(*winningAmount1)

		winner2_.WinnerAddress = accounts[winnerBIndex]
		winner2_.SolanaWinnerOwnerAddress = fluidityOwners[winnerBIndex]

		winner2_.WinningAmount = misc.NewBigInt(*winningAmount2)

		winner1 = &winner1_
		winner2 = &winner2_
	}

	if fluidityTransaction.Wrap != nil {
		var (
			accountIndex       = instruction.Accounts[5]
			senderAddress      = accounts[accountIndex]
			senderOwnerIndex   = instruction.Accounts[7]
			senderOwnerAddress = fluidityOwners[senderOwnerIndex]
			swapAmount_        = fluidityTransaction.Wrap.Value
		)

		swapAmount := misc.BigIntFromUint64(swapAmount_)

		if senderOwnerAddress != senderAddress {
			log.App(func(k *log.Log) {
				k.Format(
					"Got a fluid program transaction, but token mint was wrong! %v",
					transactionHash,
				)
			})
			return nil, nil, nil, nil, nil
		}

		swapWrap_ := user_actions.NewSwap(
			network.NetworkSolana,
			senderAddress,
			transactionHash,
			swapAmount,
			true,
			tokenDetails.TokenShortName,
			tokenDetails.TokenDecimals,
		)

		swapWrap_.SolanaSenderOwnerAddress = senderOwnerAddress

		swapWrap = &swapWrap_
	}

	if fluidityTransaction.Unwrap != nil {
		var (
			unwrapIndex        = instruction.Accounts[5]
			senderAddress      = accounts[unwrapIndex] // solana address
			senderOwnerIndex   = instruction.Accounts[7] // spl address
			senderOwnerAddress = fluidityOwners[senderOwnerIndex]
			swapAmount_        = fluidityTransaction.Unwrap.Value
		)

		if senderOwnerAddress != senderAddress {
			log.App(func(k *log.Log) {
				k.Format(
					"Got a fluid program transaction, but token mint was wrong! %v",
					transactionHash,
				)
			})
			return nil, nil, nil, nil, nil
		}

		swapAmount := misc.BigIntFromUint64(swapAmount_)

		swapUnwrap_ := user_actions.NewSwap(
			network.NetworkSolana,
			senderAddress,
			transactionHash,
			swapAmount,
			false,
			tokenDetails.TokenShortName,
			tokenDetails.TokenDecimals,
		)

		swapUnwrap_.SolanaSenderOwnerAddress = senderOwnerAddress

		swapUnwrap = &swapUnwrap_
	}

	return winner1, winner2, swapWrap, swapUnwrap, nil
}

// processSplTransaction, returning possibly two transfers depending on
// what's contained within the spl transaction
func processSplTransaction(transactionHash string, instruction solana.TransactionInstruction, adjustedFee *big.Rat, accounts []string, fluidityOwners []string, fluidityTokenMintAddress, fluidityPdaPubkey string, tokenDetails token_details.TokenDetails) (transfer1 *user_actions.UserAction, transfer2 *user_actions.UserAction, err error) {
	splTransaction, err := spl_token.DecodeSplUserAction(instruction.Data)

	if errors.Is(err, fluidity.UnknownInstructionError) {
		log.Debug(func(k *log.Log) {
			k.Message = "Ignoring unknown SPL instruction"
			k.Payload = err
		})

		// we don't care about this error, so don't return it
		return nil, nil, nil
	}

	if err != nil {
		return nil, nil, fmt.Errorf(
			"failed to decode SPL transaction data! %#v %v",
			instruction.Data,
			err,
		)
	}

	if splTransaction.Transfer != nil {

		var (
			fromIndex = instruction.Accounts[0]
			toIndex   = instruction.Accounts[1]
		)

		// is not a fluidity transfer
		if fluidityOwners[fromIndex] == "" {
			return nil, nil, nil
		}

		var (
			transferAmount_       = splTransaction.Transfer.Amount
			senderAddress         = accounts[fromIndex]
			senderOwnerAddress    = fluidityOwners[fromIndex]
			recipientAddress      = accounts[toIndex]
			recipientOwnerAddress = fluidityOwners[toIndex]
		)

		tokenIsMintEvent := tokenIsMintEvent(
			senderAddress,
			recipientAddress,
			fluidityTokenMintAddress,
			fluidityPdaPubkey,
		)

		if !tokenIsMintEvent {

			transferAmount := misc.BigIntFromUint64(transferAmount_)

			transfer_ := user_actions.NewSend(
				network.NetworkSolana,
				senderAddress,
				recipientAddress,
				transactionHash,
				transferAmount,
				tokenDetails.TokenShortName,
				tokenDetails.TokenDecimals,
			)

			transfer_.SolanaSenderOwnerAddress = senderOwnerAddress
			transfer_.SolanaRecipientOwnerAddress = recipientOwnerAddress
			transfer_.AdjustedFee = adjustedFee

			transfer1 = &transfer_
		}
	}

	if splTransaction.TransferChecked != nil {

		var (
			tokenIndex = instruction.Accounts[1]
			fromIndex  = instruction.Accounts[0]
			toIndex    = instruction.Accounts[2]
		)

		// is not a fluidity transfer
		if accounts[tokenIndex] != fluidityTokenMintAddress {
			return nil, nil, nil
		}

		var (
			senderAddress         = accounts[fromIndex]
			senderOwnerAddress    = fluidityOwners[fromIndex]
			recipientAddress      = accounts[toIndex]
			recipientOwnerAddress = fluidityOwners[toIndex]
			transferAmount_       = splTransaction.TransferChecked.Amount
		)

		transferAmount := misc.BigIntFromUint64(transferAmount_)

		tokenIsMintEvent := tokenIsMintEvent(
			senderAddress,
			recipientAddress,
			fluidityTokenMintAddress,
			fluidityPdaPubkey,
		)

		if !tokenIsMintEvent {

			transfer_ := user_actions.NewSend(
				network.NetworkSolana,
				senderAddress,
				recipientAddress,
				transactionHash,
				transferAmount,
				tokenDetails.TokenShortName,
				tokenDetails.TokenDecimals,
			)

			transfer_.SolanaSenderOwnerAddress = senderOwnerAddress
			transfer_.SolanaRecipientOwnerAddress = recipientOwnerAddress
			transfer_.AdjustedFee = adjustedFee

			transfer2 = &transfer_
		}
	}

	return transfer1, transfer2, nil
}

func fluidityPayoutWasBlocked(transaction worker.SolanaApplicationTransaction) bool {
	logs := transaction.Result.Meta.Logs

	for _, line := range logs {
		if strings.HasPrefix(line, blockPayoutPrefix) {
			return true
		}
	}

	return false
}
