// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"
	"os"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/payout"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	"github.com/fluidity-money/fluidity-app/common/solana/spl-token"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
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

	// EnvFluidityDataPubkey is the public key of an initialised fluidity
	// data account
	EnvFluidityDataPubkey = `FLU_SOLANA_FLUIDITY_DATA_PUBKEY`

	// EnvUnderlyingMintPubkey is the mint address of the underlying token
	EnvUnderlyingMintPubkey = `FLU_SOLANA_UNDERLYING_MINT_PUBKEY`

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

	// EnvDebugFakePayouts is a boolean that if true, logs payout instead of
	// submitting them to solana
	EnvDebugFakePayouts = `FLU_DEBUG_FAKE_PAYOUTS`

	// EnvSolPythPubkey is the public key of the pyth price account for SOL
	EnvSolPythPubkey = `FLU_SOLANA_SOL_PYTH_PUBKEY`

	// EnvTokenName is the same of the token being wrapped
	EnvTokenName = `FLU_SOLANA_TOKEN_NAME`
)

func main() {
	var (
		rpcUrl = util.PickEnvOrFatal(EnvSolanaRpcUrl)

		payerPrikey      = util.GetEnvOrFatal(EnvPayerPrikey)
		topicWinnerQueue = util.GetEnvOrFatal(EnvTopicWinnerQueue)

		fluidityPubkey   = pubkeyFromEnv(EnvFluidityPubkey)
		fluidDataPubkey  = pubkeyFromEnv(EnvFluidityDataPubkey)
		tokenMintPubkey  = pubkeyFromEnv(EnvUnderlyingMintPubkey)
		fluidMintPubkey  = pubkeyFromEnv(EnvFluidityMintPubkey)
		obligationPubkey = pubkeyFromEnv(EnvObligationPubkey)
		reservePubkey    = pubkeyFromEnv(EnvReservePubkey)

		tokenName = util.GetEnvOrFatal(EnvTokenName)

		debugFakePayouts = os.Getenv(EnvDebugFakePayouts) == "true"
	)

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
			k.Format(
				"Failed to derive the PDA account and bump seed! %v",
				err,
			)
		})
	}

	solanaClient, err := rpc.New(rpcUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the Solana RPC client!"
			k.Payload = err
		})
	}

	payer, err := solana.WalletFromPrivateKeyBase58(payerPrikey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer private key!"
			k.Payload = err
		})
	}

	queue.GetMessages(topicWinnerQueue, func(message queue.Message) {

		var winnerAnnouncement worker.SolanaWinnerAnnouncement

		message.Decode(&winnerAnnouncement)

		var (
			winningTransactionHash = winnerAnnouncement.WinningTransactionHash
			senderAddress          = winnerAnnouncement.SenderAddress
			recipientAddress       = winnerAnnouncement.RecipientAddress
			winningAmount          = winnerAnnouncement.WinningAmount
			messageTokenName       = winnerAnnouncement.TokenName
			messageFluidMintPubkey = winnerAnnouncement.FluidMintPubkey
		)

		if tokenName != messageTokenName {
			log.App(func(k *log.Log) {
				k.Format(
					"Got winning message for the wrong token %v! Skipping!",
					messageTokenName,
				)
			})

			return
		}

		if fluidMintPubkey.String() != messageFluidMintPubkey {
			log.App(func(k *log.Log) {
				k.Format(
					"Got winning message for the wrong mint %v! Skipping!",
					messageFluidMintPubkey,
				)
			})

			return
		}

		log.App(func(k *log.Log) {
			k.Format(
				"About to pay out address %v sending to %v, winning amount %v for hash %v",
				senderAddress,
				recipientAddress,
				winningAmount,
				winningTransactionHash,
			)
		})

		recentBlockHash, err := solanaClient.GetRecentBlockhash(
			"finalized",
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get a recent Solana blockhash!"
				k.Payload = err
			})
		}

		aPubkey, err := solana.PublicKeyFromBase58(senderAddress)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to decode the sender address %#v in transaction hash %#v",
					senderAddress,
					winningTransactionHash,
				)

				k.Payload = err
			})
		}

		bPubkey, err := solana.PublicKeyFromBase58(recipientAddress)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to decode the recipient address %#v in transaction hash %#v",
					recipientAddress,
					winningTransactionHash,
				)

				k.Payload = err
			})
		}

		payoutArgs := payout.PayoutArgs{
			FluidityProgramPubkey: fluidityPubkey,
			DataAccountPubkey:     fluidDataPubkey,
			MetaSplPubkey:         spl_token.TokenProgramAddressPubkey,
			TokenMintPubkey:       tokenMintPubkey,
			FluidMintPubkey:       fluidMintPubkey,
			PdaPubkey:             pdaPubkey,
			ObligationPubkey:      obligationPubkey,
			ReservePubkey:         reservePubkey,
			AccountAPubkey:        aPubkey,
			AccountBPubkey:        bPubkey,
			PayerPubkey:           payer.PublicKey(),
			WinningAmount:         winningAmount,
			TokenName:             tokenName,
			BumpSeed:              bumpSeed,
			RecentBlockHash:       recentBlockHash,
		}

		transaction, payoutInstruction, err := payout.CreatePayoutTransaction(payoutArgs)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to create a payout transaction!"
				k.Payload = err
			})
		}

		// if flag is set, print debug information and don't actually send payout
		if debugFakePayouts {
			log.Debug(func(k *log.Log) {
				k.Format(
					`Payout would have been sent with account metas:
{SPL program: %v, fluid mint: %v, PDA: %v, obligation: %v, reserve: %v, account A: %v, account B: %v, payer: %v}
and instruction data %+v`,
					spl_token.TokenProgramAddressPubkey,
					fluidMintPubkey,
					pdaPubkey,
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

		sig, err := solanaClient.SendTransaction(transaction)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to send payout transaction!"
				k.Payload = err
			})
		}

		log.App(func(k *log.Log) {
			k.Format("Sent payout transaction with signature %v", sig)
		})
	})
}
