package main_test

import (
	"fmt"
	"testing"

	workerDb "github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	workerTypes "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/tests/pipeline/libtest"
	"github.com/stretchr/testify/assert"
)

func addUtilityConfigOverride(network_ network.BlockchainNetwork, utility string,
	payoutFreqNum, payoutFreqDenom misc.BigInt, winningClasses int) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			network,
			utility_name,
			payout_freq_num,
			payout_freq_denom,
			winning_classes
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5
		);`,

		workerDb.TablePoolOverrides,
	)

	_, err := postgresClient.Exec(
		statementText,
		network_,
		utility,
		payoutFreqNum,
		payoutFreqDenom,
		winningClasses,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to insert a worker config override!"
			k.Payload = err
		})
	}
}

func TestSpecialUtilityMining(t *testing.T) {
	var (
		workerServerInTopic  = util.GetEnvOrFatal(EnvWorkerServerWorkQueue)
		workerServerOutTopic = util.GetEnvOrFatal(EnvWorkerServerPublishQueue)
	)

	const specialUtility = "test special utility"

	addUtilityConfigOverride(
		network.NetworkEthereum,
		specialUtility,
		misc.BigIntFromInt64(1),
		misc.BigIntFromInt64(4),
		4,
	)

	workerServerOut := libtest.LogMessages(workerServerOutTopic)

	generator := blockGenerator{10}

	block := generator.get(2)

	i := 0

	for _, transaction := range block.DecoratedTransactions {
		if i == 0 {
			transaction.Transfers[0].Decorator = &workerTypes.EthereumWorkerDecorator{
				UtilityName: specialUtility,
			}
		}
		i++
	}

	queue.SendMessage(workerServerInTopic, block)

	var announcement []workerTypes.EthereumAnnouncement

	err := workerServerOut.GetMessage(&announcement)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to get messages from the worker server!"
			k.Payload = err
		})
	}

	// three announcements
	assert.Equal(t, len(announcement), 3)

	// second and third announcements are both from the same tx
	assert.Equal(t, announcement[1].TransactionHash, announcement[2].TransactionHash)

	fluidPayouts0 := announcement[0].RandomPayouts[applications.UtilityFluid]

	fluidPayouts1, exists := announcement[1].RandomPayouts[applications.UtilityFluid]
	if !exists {
		fluidPayouts1, _ = announcement[2].RandomPayouts[applications.UtilityFluid]
	}

	// fluid payouts should be the same
	assert.Equal(t, fluidPayouts0[0].Usd, fluidPayouts1[0].Usd)

	specialPayout, exists := announcement[1].RandomPayouts[specialUtility]
	if !exists {
		specialPayout, _ = announcement[2].RandomPayouts[specialUtility]
	}

	// 4 payouts instead of 5
	assert.Equal(t, len(specialPayout), 4)

	// higher payouts
	assert.Greater(t, specialPayout[0].Usd, fluidPayouts1[0].Usd)
}
