package main

import (
	"context"
	"encoding/base64"
	"errors"

	"github.com/fluidity-money/fluidity-app/common/solana"
	utility_gauge "github.com/fluidity-money/fluidity-app/common/solana/utility-gauge"
	database "github.com/fluidity-money/fluidity-app/lib/databases/postgres/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	types "github.com/fluidity-money/fluidity-app/lib/types/payout"
	"github.com/fluidity-money/fluidity-app/lib/util"

	goSolana "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
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
		solanaRpcUrl  = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		solanaWsUrl   = util.GetEnvOrFatal(EnvSolanaWsUrl)
		solanaNetwork = util.GetEnvOrFatal(EnvSolanaNetwork)

		gaugemeisterPubkey    = goSolana.MustPublicKeyFromBase58(EnvGaugemeisterPubkey)
		utilityGaugeProgramId = goSolana.MustPublicKeyFromBase58(EnvUtilityGaugeProgramId)

		accountNotificationChan = make(chan solana.AccountNotification)
		errChan                 = make(chan error)
	)

	solanaClient := solanaRpc.New(solanaRpcUrl)

	solanaSubscription, err := solana.SubscribeAccount(
		solanaWsUrl,
		gaugemeisterPubkey.String(),
		accountNotificationChan,
		errChan,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "failed to subcribe to solana events!"
			k.Payload = err
		})
	}

	defer solanaSubscription.Close()

	for {
		select {
		case accountNotification := <-accountNotificationChan:
			log.Debug(func(k *log.Log) {
				k.Message = "Gaugemeister was updated!"
				k.Payload = accountNotification
			})

			var gaugemeisterData utility_gauge.Gaugemeister

			gaugemeisterDataBase64 := accountNotification.Value.Data[0]

			gaugemeisterDataBinary, err := base64.RawStdEncoding.DecodeString(gaugemeisterDataBase64)

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

				gaugePubkey := goSolana.MustPublicKeyFromBase58(gaugePubkey_)

				currentGaugePower := types.UtilityGaugePower{
					Chain:   SolanaChainName,
					Network: solanaNetwork,
					Gauge:   gaugePubkey.String(),

					Epoch:      epoch,
					Disabled:   true,
					TotalPower: misc.BigIntFromInt64(0),
				}

				var gauge utility_gauge.Gauge

				accInfoRes, err := solanaClient.GetAccountInfo(
					context.Background(),
					gaugePubkey,
				)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Format("failed to get gauge account data %v!", gaugePubkey)
						k.Payload = err
					})
				}

				gaugeDataBinary := accInfoRes.Value.Data.GetBinary()

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

				accInfoRes, err = solanaClient.GetAccountInfo(
					context.Background(),
					epochGaugePubkey,
				)

				if err != nil {
					if errors.Is(err, solanaRpc.ErrNotFound) {
						log.Debug(func(k *log.Log) {
							k.Format("could not find epochGauge at account %v (derived from %v, at epoch %v)!", epochGaugePubkey, gaugePubkey, epoch)
						})

						continue
					}

					log.Fatal(func(k *log.Log) {
						k.Format("failed to get epochGauge account data %v!", epochGaugePubkey)
						k.Payload = err
					})
				}

				epochGaugeDataBinary := accInfoRes.Value.Data.GetBinary()

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

		case err := <-errChan:
			log.Fatal(func(k *log.Log) {
				k.Message = "error from the solana websocket!"
				k.Payload = err
			})
		}
	}
}
