// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/prize-pool"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	idoQueue "github.com/fluidity-money/fluidity-app/lib/queues/ido"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvFluidityPubkey is the program id of the fluidity program
	EnvFluidityPubkey = `FLU_SOLANA_PROGRAM_ID`

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

	// EnvSwitchboardPubkey is the public key of the solend pool
	// switchboard account
	EnvSwitchboardPubkey = `FLU_SOLANA_SWITCHBOARD_PUBKEY`

	// EnvPayerPrikey is a private key of an account that holds
	// solana funds this program doesn't alter onchain state, and
	// thus won't actually spend anything
	EnvPayerPrikey = `FLU_SOLANA_TVL_PAYER_PRIKEY`
)

// pubkeyFromEnv gets and decodes a solana public key from an environment
// variable, panicking if the env doesn't exist or isn't a valid key
func pubkeyFromEnv(env string) solana.PublicKey {
	pubkeyString := util.GetEnvOrFatal(env)

	pubkey, err := solana.PublicKeyFromBase58(pubkeyString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to decode public key %s",
				env,
			)

			k.Payload = err
		})
	}

	return pubkey
}

func main() {
	var (
		fluidityPubkey    = pubkeyFromEnv(EnvFluidityPubkey)
		tvlDataPubkey     = pubkeyFromEnv(EnvTvlDataPubkey)
		solendPubkey      = pubkeyFromEnv(EnvSolendPubkey)
		obligationPubkey  = pubkeyFromEnv(EnvObligationPubkey)
		reservePubkey     = pubkeyFromEnv(EnvReservePubkey)
		pythPubkey        = pubkeyFromEnv(EnvPythPubkey)
		switchboardPubkey = pubkeyFromEnv(EnvSwitchboardPubkey)

		payerPrikey = util.GetEnvOrFatal(EnvPayerPrikey)

		solanaRpcUrl = util.PickEnvOrFatal(EnvSolanaRpcUrl)
	)

	payer, err := solana.WalletFromPrivateKeyBase58(payerPrikey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer prikey!"
			k.Payload = err
		})
	}

	httpClient, err := rpc.New(solanaRpcUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the Solana RPC client!"
			k.Payload = err
		})
	}

	tvl, err := prize_pool.GetTvl(
		httpClient,
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
			k.Message = "Failed to get tvl!"
			k.Payload = err
		})
	}

	log.Debug(func(k *log.Log) {
		k.Format("Got TVL from chain: %d", tvl)
	})

	tvlContainer := idoQueue.TvlUpdateContainer{
		Tvl:             tvl,
		Network:         network.NetworkSolana,
		ContractAddress: fluidityPubkey.String(),
	}

	queue.SendMessage(idoQueue.TopicTvlUpdates, tvlContainer)
}
