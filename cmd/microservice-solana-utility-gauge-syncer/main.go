package main

import (
	"context"
	"time"

	utility_gauge "github.com/fluidity-money/fluidity-app/common/solana/utility-gauge"
	database "github.com/fluidity-money/fluidity-app/lib/databases/postgres/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	queue "github.com/fluidity-money/fluidity-app/lib/queue"
	utility_gauge_queue "github.com/fluidity-money/fluidity-app/lib/queues/utility-gauge"
	"github.com/fluidity-money/fluidity-app/lib/util"

	types "github.com/fluidity-money/fluidity-app/lib/types/payout"

	solana "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvGaugemeisterPubkey is the public key of the gaugemeister of EnvGaugeProgramId
	EnvGaugemeisterPubkey = `FLU_SOLANA_GAUGEMEISTER_PUBKEY`
)

func main() {
	var (
		rpcUrl             = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		gaugemeisterPubkey = solana.MustPublicKeyFromBase58(EnvGaugemeisterPubkey)
	)

	solanaClient := solanaRpc.New(rpcUrl)

	// Get current rewards epoch
	var gaugemeister utility_gauge.Gaugemeister

	accInfoRes, err := solanaClient.GetAccountInfo(
		context.Background(),
		gaugemeisterPubkey,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("failed to get gaugemeister account %v!", gaugemeisterPubkey)
			k.Payload = err
		})
	}

	gaugemeisterDataBinary := accInfoRes.Value.Data.GetBinary()

	// remove anchor account discriminator from data binary
	gaugemeisterAccData := gaugemeisterDataBinary[8:]

	err = borsh.Deserialize(&gaugemeister, gaugemeisterAccData)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "failed to decode gaugemeister account data from rpc result!"
			k.Payload = err
		})
	}

	var (
		// epochDurationSeconds is the voting period of each epoch
		epochDurationSeconds = gaugemeister.EpochDurationSeconds

		// nextEpochStartsAt is the unix time when next epoch starts
		nextEpochStartsAt = gaugemeister.NextEpochStartsAt

		// currentRewardsEpoch is epoch with active rewards
		// (currentRewardsEpoch + 1) is the epoch currently voting on
		currentRewardsEpoch = gaugemeister.CurrentRewardsEpoch
	)

	currentUnixTimestamp := time.Now().Unix()

	timeoutSeconds_ := nextEpochStartsAt - uint64(currentUnixTimestamp)

	timeoutSeconds := time.Duration(timeoutSeconds_) * time.Second

	for _ = range time.Tick(timeoutSeconds) {
		whitelistedGauges := database.GetWhitelistedGauges()

		// newRewardsEpoch is the updated epoch with active rewards
		newRewardsEpoch := currentRewardsEpoch + 1

		updatedGauges := types.EpochGauges{
			Gaugemeister: gaugemeisterPubkey.String(),
			Epoch:        newRewardsEpoch,
			Gauges:       whitelistedGauges,
		}

		queue.SendMessage(utility_gauge_queue.TopicUtilityGauges, updatedGauges)

		timeoutSeconds_ = uint64(epochDurationSeconds)
		timeoutSeconds = time.Duration(timeoutSeconds_) * time.Second
	}
}
