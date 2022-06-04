package main

import (
	"context"

	utility_gauge "github.com/fluidity-money/fluidity-app/common/solana/utility-gauge"
	database "github.com/fluidity-money/fluidity-app/lib/databases/postgres/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/utility-gauge"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	types "github.com/fluidity-money/fluidity-app/lib/types/payout"
	"github.com/fluidity-money/fluidity-app/lib/util"

	solana "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvSolanaNetwork is the network of the Gauge ProgramId
	EnvSolanaNetwork = `FLU_SOLANA_NETWORK`

	// EnvGaugeProgramId is the program used to vote on utility gauges
	EnvGaugeProgramId = `FLU_SOLANA_GAUGE_PROGRAM_ID`
)

const (
	SOLANA_CHAIN = "solana"
)

func main() {
	var (
		rpcUrl        = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		solanaNetwork = util.GetEnvOrFatal(EnvSolanaNetwork)

		gaugeProgramId = solana.MustPublicKeyFromBase58(EnvGaugeProgramId)
	)

	solanaClient := solanaRpc.New(rpcUrl)

	queue.GetEpochGauges(func(epochGauges types.EpochGauges) {

		var (
			epoch  = epochGauges.Epoch
			gauges = epochGauges.Gauges
		)

		for _, gaugePubkey_ := range gauges {

			gaugePubkey := solana.MustPublicKeyFromBase58(gaugePubkey_)

			currentGaugePower := types.UtilityGaugePower{
				Chain:   SOLANA_CHAIN,
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

			// TODO: Cannot differentiate between RPC failures, or if EpochGauge
			// simply did not exist at past epoch
			epochGaugePubkey, _, err := utility_gauge.DeriveEpochGaugePubkey(
				gaugeProgramId,
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

	})
}
