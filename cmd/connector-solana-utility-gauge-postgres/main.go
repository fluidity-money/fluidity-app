// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	utility_gauge "github.com/fluidity-money/fluidity-app/common/solana/utility-gauge"
	database "github.com/fluidity-money/fluidity-app/lib/databases/postgres/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	types "github.com/fluidity-money/fluidity-app/lib/types/payout"
	solana_types "github.com/fluidity-money/fluidity-app/lib/types/solana"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/near/borsh-go"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvSolanaWsUrl is the RPC url of the solana node to connect to
	EnvSolanaWsUrl = `FLU_SOLANA_WS_URL`

	// EnvSolanaNetwork is the network of the Gauge ProgramId
	EnvSolanaNetwork = `FLU_SOLANA_NETWORK`

	// EnvGaugemeisterPubkey is the pubkey of the currently active gaugemeister
	EnvGaugemeisterPubkey = `FLU_SOLANA_GAUGEMEISTER_PUKEY`

	// EnvGaugeProgramId is the program used to vote on utility gauges
	EnvUtilityGaugeProgramId = `FLU_SOLANA_UTILITY_GAUGE_PROGRAM_ID`
)

// SolanaChainName is the chain UtilityGauge runs on
const SolanaChainName = "solana"

func main() {
	var (
		solanaRpcUrl = util.PickEnvOrFatal(EnvSolanaRpcUrl)
		solanaWsUrl  = util.PickEnvOrFatal(EnvSolanaWsUrl)

		solanaNetwork = util.GetEnvOrFatal(EnvSolanaNetwork)

		gaugemeisterPubkey_    = util.GetEnvOrFatal(EnvGaugemeisterPubkey)
		utilityGaugeProgramId_ = util.GetEnvOrFatal(EnvUtilityGaugeProgramId)
	)

	httpClient, err := rpc.New(solanaRpcUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the Solana RPC client!"
			k.Payload = err
		})
	}

	websocketClient, err := rpc.NewWebsocket(solanaWsUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the Solana websocket client!"
			k.Payload = err
		})
	}

	gaugemeisterPubkey, err := solana.PublicKeyFromBase58(
		gaugemeisterPubkey_,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode Gaugemeister's public key!"
			k.Payload = err
		})
	}

	utilityGaugeProgramId, err := solana.PublicKeyFromBase58(
		utilityGaugeProgramId_,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode a utility gauge program id!"
			k.Payload = err
		})
	}

	websocketClient.SubscribeAccount(gaugemeisterPubkey, func(account solana_types.Account) {
		var gaugemeisterData utility_gauge.Gaugemeister

		gaugemeisterDataBinary, err := account.GetBinary()

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "could not decode account data from base64!"
				k.Payload = err
			})
		}

		gaugemeisterAccDataBinary := gaugemeisterDataBinary[8:]

		err = borsh.Deserialize(&gaugemeisterData, gaugemeisterAccDataBinary)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "failed to decode data account!"
				k.Payload = err
			})
		}

		var epoch = gaugemeisterData.CurrentRewardsEpoch

		gauges := database.GetWhitelistedGauges()

		for _, gaugePubkey_ := range gauges {

			gaugePubkey, err := solana.PublicKeyFromBase58(gaugePubkey_)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to decode gauge public key %v, %#v",
						EnvGaugemeisterPubkey,
						gaugePubkey_,
					)

					k.Payload = err
				})
			}

			currentGaugePower := types.UtilityGaugePower{
				Chain:   SolanaChainName,
				Network: solanaNetwork,
				Gauge:   gaugePubkey.String(),

				Epoch:      epoch,
				Disabled:   true,
				TotalPower: misc.BigIntFromInt64(0),
			}

			var gauge utility_gauge.Gauge

			accInfoRes, err := httpClient.GetAccountInfo(
				gaugePubkey,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format("failed to get gauge account data %v!", gaugePubkey)
					k.Payload = err
				})
			}

			gaugeDataBinary, err := accInfoRes.GetBinary()

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to convert the gauge account data from base64!"
					k.Payload = err
				})
			}

			// remove account discriminator from data binary
			gaugeAccData := gaugeDataBinary[8:]

			err = borsh.Deserialize(&gauge, gaugeAccData)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format("failed to decode gauge account data of %v!", gaugePubkey)
					k.Payload = err
				})
			}

			var isDisabled = gauge.IsDisabled

			// if isDisabled, Gauge is not participating in this round of rewards
			if isDisabled {
				database.InsertUtilityGauge(currentGaugePower)

				continue
			}

			currentGaugePower.Disabled = isDisabled

			epochGaugePubkey, _, err := utility_gauge.DeriveEpochGaugePubkey(
				utilityGaugeProgramId,
				gaugePubkey,
				epoch,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format("failed to derive epochGauge from gauge account %v!", gaugePubkey)
					k.Payload = err
				})
			}

			var epochGauge utility_gauge.EpochGauge

			accInfoRes, err = httpClient.GetAccountInfo(
				epochGaugePubkey,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"failed to get epochGauge account data %v!",
						epochGaugePubkey,
					)

					k.Payload = err
				})
			}

			epochGaugeDataBinary, err := accInfoRes.GetBinary()

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"failed to convert epoch gauge data binary account data %v!",
						epochGaugePubkey,
					)

					k.Payload = err
				})
			}

			// remove account discriminator from data binary
			epochGaugeAccData := epochGaugeDataBinary[8:]

			err = borsh.Deserialize(&epochGauge, epochGaugeAccData)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format("failed to decode epochGauge account data from %v!", epochGaugePubkey)
					k.Payload = err
				})
			}

			var totalPower = epochGauge.TotalPower

			currentGaugePower.TotalPower = misc.BigIntFromUint64(totalPower)

			database.InsertUtilityGauge(currentGaugePower)
		}
	})
}
