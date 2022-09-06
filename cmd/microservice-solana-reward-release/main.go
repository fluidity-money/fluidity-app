// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"encoding/base64"
	"fmt"
	"os"
	"strconv"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/payout"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	"github.com/fluidity-money/fluidity-app/common/solana/spl-token"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvFluidityPubkey is the program id of the fluidity program
	EnvFluidityPubkey = `FLU_SOLANA_PROGRAM_ID`

	// EnvFluidityMintPubkey is the public key of the fluid token mint
	EnvFluidityMintPubkey = `FLU_SOLANA_FLUID_MINT_PUBKEY`

	// EnvFluidityDataPubkey is the public key of an initialised fluidity
	// data account
	EnvFluidityDataPubkey = `FLU_SOLANA_FLUIDITY_DATA_PUBKEY`

	// EnvUnderlyingMintPubkey is the mint address of the underlying token
	EnvUnderlyingMintPubkey = `FLU_SOLANA_UNDERLYING_MINT_PUBKEY`

	// EnvObligationPubkey is the public key of the solend pool obligation
	// account
	EnvObligationPubkey = `FLU_SOLANA_OBLIGATION_PUBKEY`

	// EnvReservePubkey is the public key of the solend pool reserve account
	EnvReservePubkey = `FLU_SOLANA_RESERVE_PUBKEY`

	// EnvTokenName is the same of the token being wrapped
	EnvTokenName = `FLU_SOLANA_TOKEN_NAME`

	// EnvPubkeySender to receive the sender's prize
	EnvPubkeySender = `FLU_SOLANA_PUBKEY_SENDER`

	// EnvPubkeyReceiver to receive the receiver's prize
	EnvPubkeyReceiver = `FLU_SOLANA_PUBKEY_RECEIVER`

	// EnvPayerPubkey to use as the payer (would be the multisig)
	EnvPayerPubkey = `FLU_SOLANA_PAYER_PUBKEY`

	// EnvWinningAmount to pay out during the reward process
	EnvWinningAmount = `FLU_SOLANA_WINNING_AMOUNT`
)

func main() {
	var (
		rpcUrl = util.PickEnvOrFatal(EnvSolanaRpcUrl)

		fluidityPubkey   = pubkeyFromEnv(EnvFluidityPubkey)
		fluidDataPubkey  = pubkeyFromEnv(EnvFluidityDataPubkey)
		tokenMintPubkey  = pubkeyFromEnv(EnvUnderlyingMintPubkey)
		fluidMintPubkey  = pubkeyFromEnv(EnvFluidityMintPubkey)
		obligationPubkey = pubkeyFromEnv(EnvObligationPubkey)
		reservePubkey    = pubkeyFromEnv(EnvReservePubkey)
		aPubkey          = pubkeyFromEnv(EnvPubkeySender)
		bPubkey          = pubkeyFromEnv(EnvPubkeyReceiver)
		payerPubkey      = pubkeyFromEnv(EnvPayerPubkey)

		winningAmount_ = util.GetEnvOrFatal(EnvWinningAmount)
		tokenName      = util.GetEnvOrFatal(EnvTokenName)
	)

	winningAmount, err := strconv.ParseUint(winningAmount_, 10, 64)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse the winning amount to a uint64!"
			k.Payload = err
		})
	}

	client, err := rpc.New(rpcUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to get the RPC!"
			k.Payload = err
		})
	}

	var (
		obligationString = fmt.Sprintf("FLU:%s_OBLIGATION", tokenName)
		obligationBytes_ = []byte(obligationString)
		obligationBytes  = [][]byte{obligationBytes_}
	)

	pdaPubkey, bumpSeed, err := solana.FindProgramAddress(
		obligationBytes,
		fluidityPubkey,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to find the Fluidity program address!"
			k.Payload = err
		})
	}

	recentBlockHash, err := client.GetRecentBlockhash("finalized")

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to get the recent block hash!"
			k.Payload = err
		})
	}

	payoutArgs := payout.PayoutArgs{
		DataAccountPubkey: fluidDataPubkey,
		MetaSplPubkey:     spl_token.TokenProgramAddressPubkey,
		TokenMintPubkey:   tokenMintPubkey,
		FluidMintPubkey:   fluidMintPubkey,
		PdaPubkey:         pdaPubkey,
		ObligationPubkey:  obligationPubkey,
		ReservePubkey:     reservePubkey,
		AccountAPubkey:    aPubkey,
		AccountBPubkey:    bPubkey,
		PayerPubkey:       payerPubkey,
		WinningAmount:     winningAmount,
		TokenName:         tokenName,
		BumpSeed:          bumpSeed,
		RecentBlockHash:   recentBlockHash,
	}

	payoutTransaction, _, err := payout.CreatePayoutTransaction(payoutArgs)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create a payout transaction!"
			k.Payload = err
		})
	}

	payoutTransactionBytes, err := payoutTransaction.MarshalBinary()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to marshal the payout transaction as bytes!"
			k.Payload = err
		})
	}

	encoder := base64.NewEncoder(base64.StdEncoding, os.Stdout)

	_, err = encoder.Write(payoutTransactionBytes)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to write the payout instruction to stdout via base64!"
			k.Payload = err
		})
	}
}
