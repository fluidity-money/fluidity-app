package main

import (
	"context"
	"math/big"
	"time"

	utility_gauge "github.com/fluidity-money/fluidity-app/common/solana/utility-gauge"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/payout"

	solana "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

// These are hardcoded test addresses that we use to derive
// gauges -> epochGauges.
// epochGauges is derived from voteEpoch, which signifies which
// "round" the vote is for
const SABER_ADDR = "Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1"
const ORCA_ADDR = "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE"
const GAUGEMEISTER_ADDR = "GvL8ZtvSzttTbvxTefDZzDETbDHeYuAtM9QS6UWSBdGt"
const rpcUrl = "http://localhost:8899"
const SOLANA_NETWORK = "devnet"

func main() {
	var (
		saberPubkey        = solana.MustPublicKeyFromBase58(SABER_ADDR)
		orcaPubkey         = solana.MustPublicKeyFromBase58(ORCA_ADDR)
		gaugemeisterPubkey = solana.MustPublicKeyFromBase58(GAUGEMEISTER_ADDR)

		solanaClockPubkey = solana.SysVarClockPubkey
	)

	solanaClient := solanaRpc.New(rpcUrl)

	// Get curernt rewards epoch
	var gaugemeister utility_gauge.Gaugemeister

	accInfoRes, err := solanaClient.GetAccountInfoWithOpts(
		context.Background(),
		gaugemeisterPubkey,
		solanaRpc.finalized,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("failed to get gaugemeister account %v!", gaugemeisterPubkey)
			k.Payload = err
		})
	}

	gaugemeisterDataBinary := accInfoRes.Account.Data

	// remove account discriminator from data binary
	gaugemeisterAccData := gaugemeisterDataBinary[8:]

	err = borsh.Deserialize(&gaugemeister, gaugemeisterAccData)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "failed to decode gaugemeister account data from rpc result!"
			k.Payload = err
		})
	}

	var (
		epochDurationSeconds = gaugemeister.EpochDurationSeconds
		nextEpochStartsAt    = gaugemeister.NextEpochStartsAt
		currentRewardsEpoch  = gaugemeister.CurrentRewardsEpoch
	)

	current_unix_timestamp := time.Now().Unix()

	// Derive Gauges from whitelisted Protocols
	// and Gaugemeister
	whitelistedProtocols = []solana.PublicKey{saberPubkey, orcaPubkey}

	for _, protocolPubkey := range whitelistedProtocols {
		gaugePubkey, _, err = utility_gauge.DeriveGaugePubkey(
			gaugemeisterPubkey,
			protocolPubkey,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("failed to derive gauge from protocol account %v!", protocolPubkey)
				k.Payload = err
			})
		}

		var gauge utility_gauge.Gauge

		accInfoRes, err = solanaClient.GetAccountInfoWithOpts(
			context.Background(),
			gaugePubkey,
			solanaRpc.finalized,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("failed to get gauge account data %v!", gaugePubkey)
				k.Payload = err
			})
		}

		gaugeDataBinary := accInfoRes.Account.Data

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

		// if isDisabled, Gauge is not participating in this round of voting
		if isDisabled {
			continue
		}

		// TODO: Cannot differentiate between RPC failures, or if EpochGauge
		// simply did not exist at past epoch
		epochGaugePubkey, _, err = utility_gauge.DeriveEpochGaugePubkey(
			gaugePubkey,
			currentRewardsEpoch,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("failed to derive epochGauge from gauge account %v!", gaugePubkey)
				k.Payload = err
			})
		}

		var epochGauge utiliity_gauge.EpochGauge

		accInfoRes, err = solanaClient.GetAccountInfoWithOpts(
			context.Background(),
			epochGaugePubkey,
			solanaRpc.finalized,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("failed to get epochGauge account data %v!", epochGaugePubkey)
				k.Payload = err
			})
		}

		epochGaugeDataBinary := accInfoRes.Account.Data

		// remove account discriminator from data binary
		epochGaugeAccData := epochGaugeDataBinary[8:]

		err = borsh.Deserialize(&epochGauge, epochGaugeAccData)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("failed to decode epochGauge account data from %v!", epochGaugePubkey)
				k.Payload = err
			})
		}

		epochGaugeTotalPower := big.NewInt(0)
		epochGaugeTotalPower.SetUint64(epochGauge.total_power)

		// Save to Postgres
		currentGaugePower := payout.UtilityGaugePower{
			Network:  SOLANA_NETWORK,
			Protocol: misc.Blob(protocolPubkey.Bytes()),
			Epoch:    currentRewardsEpoch,

			TotalPower: misc.BigIntFromUint64(epochGauge.total_power),
		}

	}
}
