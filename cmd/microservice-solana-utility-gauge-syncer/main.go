package main

import (
	"context"
	"time"

	database "github.com/fluidity-money/fluidity-app/lib/databases/postgres/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	queue "github.com/fluidity-money/fluidity-app/lib/queue"
	utility_gauge_queue "github.com/fluidity-money/fluidity-app/lib/queues/utility-gauge"
	"github.com/fluidity-money/fluidity-app/lib/util"

	types "github.com/fluidity-money/fluidity-app/lib/types/payout"

	solana "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvUtilityGaugeProgramId = `FLU_UTILITY_GAUGE_PROGRAM_ID`

	// EnvGaugemeisterPubkey is the public key of the gaugemeister of EnvGaugeProgramId
	EnvGaugemeisterPubkey = `FLU_SOLANA_GAUGEMEISTER_PUBKEY`
)

func main() {
	var (
		rpcUrl                = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		utilityGaugeProgramId = solana.MustPublicKeyFromBase58(EnvUtilityGaugeProgramId)
		gaugemeisterPubkey    = solana.MustPublicKeyFromBase58(EnvGaugemeisterPubkey)
	)

	solanaClient := solanaRpc.New(rpcUrl)

	// Get current rewards epoch
	gaugemeister := getGaugemeisterData(solanaClient, gaugemeisterPubkey)

	var (
		// nextEpochStartsAt is the unix time when next epoch starts
		nextEpochStartsAt = gaugemeister.NextEpochStartsAt

		// currentRewardsEpoch is epoch with active rewards
		// (currentRewardsEpoch + 1) is the epoch currently being voted on
		currentRewardsEpoch = gaugemeister.CurrentRewardsEpoch
	)

	currentUnixTimestamp := time.Now().Unix()

	timeoutSeconds_ := nextEpochStartsAt - uint64(currentUnixTimestamp)

	timeoutSeconds := time.Duration(timeoutSeconds_) * time.Second

	for _ = range time.Sleep(timeoutSeconds) {

		// Call Trigger next Epoch here!
		triggerNextEpochBytes_ := "TriggerNextEpoch"

		triggerNextEpochBytes := [8]byte{200, 53, 104, 185, 85, 78, 187, 74}

		triggerNextEpochAccounts := solana.AccountMetaSlice{
			gaugemeister: gaugemeisterPubkey,
		}

		triggerNextEpochInstruction := solana.NewInstruction(
			utilityGaugeProgramId,
			triggerNextEpochAccounts,
			triggerNextEpochBytes,
		)

		//		triggerNextEpochInstructionBytes, err := borsh.Serialize(triggerNextEpochInstruction)
		//
		//		if err != nil {
		//			log.Fatal(func(k *log.Log) {
		//				k.Message = "failed to serialize triggerNextEpoch instruction!"
		//				k.Payload = err
		//			})
		//		}

		instructions := []solana.Instruction{triggerNextEpochInstruction}

		transaction, err := solana.NewTransaction(instructions, recentBlockhash)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to construct triggerNextEpoch transaction!"
				k.Payload = err
			})
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

		sig, err := solanaClient.SendTransaction(context.Background(), transaction)

		gaugemeister = getGaugemeisterData(solanaClient, gaugemeisterPubkey)

		// epochDurationSeconds is the voting period duration of the epoch
		epochDurationSeconds := gaugemeister.EpochDurationSeconds

		currentRewardsEpoch = gaugemeister.CurrentRewardsEpoch

		whitelistedGauges := database.GetWhitelistedGauges()

		updatedGauges := types.EpochGauges{
			Gaugemeister: gaugemeisterPubkey.String(),
			Epoch:        currentRewardsEpoch,
			Gauges:       whitelistedGauges,
		}

		queue.SendMessage(utility_gauge_queue.TopicUtilityGauges, updatedGauges)

		timeoutSeconds_ = uint64(epochDurationSeconds)
		timeoutSeconds = time.Duration(timeoutSeconds_) * time.Second
	}
}
