// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	trf_data_store "github.com/fluidity-money/fluidity-app/common/solana/trf-data-store"
	database "github.com/fluidity-money/fluidity-app/lib/databases/postgres/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	payout_types "github.com/fluidity-money/fluidity-app/lib/types/payout"
	solana_types "github.com/fluidity-money/fluidity-app/lib/types/solana"
	"github.com/fluidity-money/fluidity-app/lib/util"

	borsh "github.com/near/borsh-go"
)

const (
	// EnvSolanaWsUrl is the RPC url of the solana node to connect to
	EnvSolanaWsUrl = `FLU_SOLANA_WS_URL`

	// EnvSolanaNetwork is the network the TRF variables affect
	EnvSolanaNetwork = `FLU_SOLANA_NETWORK`

	// EnvFluidityPubkey is the program id of the trf data store account
	EnvTrfDataStoreProgramId = `FLU_TRF_DATA_STORE_PROGRAM_ID`
)

func main() {
	var (
		solanaWsUrl = util.PickEnvOrFatal(EnvSolanaWsUrl)

		trfDataStoreProgramId = util.GetEnvOrFatal(EnvTrfDataStoreProgramId)
		solanaNetwork         = util.GetEnvOrFatal(EnvSolanaNetwork)
	)

	trfDataStorePubkey, err := solana.PublicKeyFromBase58(
		trfDataStoreProgramId,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to get the trf progarm store id %v, %#v",
				EnvTrfDataStoreProgramId,
				trfDataStoreProgramId,
			)

			k.Payload = err
		})
	}

	var (
		trfDataStoreString = "trfDataStore"
		trfDataStoreBytes_ = []byte(trfDataStoreString)
		trfDataStoreBytes  = [][]byte{trfDataStoreBytes_}
	)

	trfDataStorePda, _, err := solana.FindProgramAddress(
		trfDataStoreBytes,
		trfDataStorePubkey,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "failed to derive trf-data-store pda!"
			k.Payload = err
		})
	}

	websocket, err := rpc.NewWebsocket(solanaWsUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create a Solana websocket!"
			k.Payload = err
		})
	}

	websocket.SubscribeAccount(trfDataStorePda, func(account solana_types.Account) {
		log.Debug(func(k *log.Log) {
			k.Message = "Tribeca updated TRF vars!"
		})

		var trfDataStoreData trf_data_store.TrfDataStore

		trfDataStoreDataBinary, err := account.GetBinary()

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "failed to decode account data from base64!"
				k.Payload = err
			})
		}

		// remove account discriminator from data binary
		trfDataStoreAccData := trfDataStoreDataBinary[8:]

		err = borsh.Deserialize(&trfDataStoreData, trfDataStoreAccData)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "failed to decode data account!"
				k.Payload = err
			})
		}

		var (
			deltaWeightNum   = trfDataStoreData.DeltaWeightNum
			deltaWeightDenom = trfDataStoreData.DeltaWeightDenom
			winningClasses   = trfDataStoreData.WinningClasses
			payoutFreqNum    = trfDataStoreData.PayoutFreqNum
			payoutFreqDenom  = trfDataStoreData.PayoutFreqDenom
		)

		trfVars := payout_types.TrfVars{
			Chain:            "solana",
			Network:          solanaNetwork,
			PayoutFreqNum:    int64(payoutFreqNum),
			PayoutFreqDenom:  int64(payoutFreqDenom),
			DeltaWeightNum:   int64(deltaWeightNum),
			DeltaWeightDenom: int64(deltaWeightDenom),
			WinningClasses:   int(winningClasses),
		}

		database.InsertTrfVars(trfVars)
	})
}
