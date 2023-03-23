package main_test

import (
	"fmt"
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	workerTypes "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/tests/pipeline/libtest"
	"github.com/stretchr/testify/assert"
)

const (
	// EnvWorkerServerWorkQueue is the queue
	// that the worker server receives messages on
	EnvWorkerServerWorkQueue = `FLU_ETHEREUM_WORK_QUEUE`

	// EnvWorkerServerPublishQueue is the queue the
	// worker server outputs messages on
	EnvWorkerServerPublishQueue = `FLU_ETHEREUM_AMQP_QUEUE_NAME`
)

// updates worker config (so that we can set defaults and buffer sizes properly)
// TODO replace this with a contract once worker config is onchain
func updateWorkerConfigEthereum(config worker.WorkerConfigEthereum) {
	client := postgres.Client()

	statementText := fmt.Sprintf(`
	UPDATE %s
	SET
	    default_seconds_since_last_block = $1,
	    current_atx_transaction_margin = $2,
	    default_transfers_in_block = $3,
	    atx_buffer_size = $4,
	    epoch_blocks_size = $5
	WHERE network = $6
	`,

		worker.TableWorkerConfigEthereum,
	)

	_, err := client.Exec(
		statementText,
		config.DefaultSecondsSinceLastBlock,
		config.CurrentAtxTransactionMargin,
		config.DefaultTransfersInBlock,
		config.AtxBufferSize,
		config.EpochBlocks,
		config.Network,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to update worker config!"
			k.Payload = err
		})
	}
}

type blockGenerator struct {
	blockNumber int64
}

func getTransactions(count int) map[ethereum.Hash]workerTypes.EthereumDecoratedTransaction {
	transactions := make(map[ethereum.Hash]workerTypes.EthereumDecoratedTransaction)

	for i := 0; i < count; i++ {
		transactions[libtest.RandomHash()] = workerTypes.EthereumDecoratedTransaction{
			Transaction: ethereum.Transaction{
				Type:      2, // need to set this to London
				GasFeeCap: misc.BigIntFromInt64(100000000),
				GasTipCap: misc.BigIntFromInt64(100000000),
				GasPrice:  misc.BigIntFromInt64(1000000000),
			},
			Receipt: ethereum.Receipt{
				GasUsed: misc.BigIntFromInt64(10000000000),
			},
			Transfers: []workerTypes.EthereumDecoratedTransfer{
				{
					TransactionHash:  libtest.RandomHash(),
					SenderAddress:    libtest.RandomAddress(),
					RecipientAddress: libtest.RandomAddress(),
					Decorator:        nil,
					AppEmissions:     workerTypes.EthereumAppFees{},
				},
			},
		}
	}

	return transactions
}
func (b *blockGenerator) get(transactionCount int) workerTypes.EthereumHintedBlock {
	b.blockNumber = b.blockNumber + 1

	block := workerTypes.EthereumHintedBlock{
		BlockHash:             libtest.RandomHash(),
		BlockBaseFee:          misc.BigIntFromInt64(1),
		BlockTime:             100,
		BlockNumber:           misc.BigIntFromInt64(b.blockNumber),
		DecoratedTransactions: getTransactions(transactionCount),
	}

	return block
}

func TestWorkerEpochs(t *testing.T) {
	var (
		workerServerInTopic  = util.GetEnvOrFatal(EnvWorkerServerWorkQueue)
		workerServerOutTopic = util.GetEnvOrFatal(EnvWorkerServerPublishQueue)
	)

	workerServerOut := libtest.LogMessages(workerServerOutTopic)

	// update workerconfig to remove the defaults
	config := workerTypes.WorkerConfigEthereum{
		Network:                      network.NetworkEthereum,
		DefaultSecondsSinceLastBlock: 12,
		CurrentAtxTransactionMargin:  0,
		DefaultTransfersInBlock:      0,
		AtxBufferSize:                2,
		EpochBlocks:                  2,
	}

	updateWorkerConfigEthereum(config)

	generator := blockGenerator{10}

	// first epoch
	queue.SendMessage(workerServerInTopic, generator.get(1))
	queue.SendMessage(workerServerInTopic, generator.get(2))

	// second epoch
	queue.SendMessage(workerServerInTopic, generator.get(2))
	queue.SendMessage(workerServerInTopic, generator.get(1))

	announcements := make([][]workerTypes.EthereumAnnouncement, 4)

	for i := 0; i < 4; i++ {
		var announcement []workerTypes.EthereumAnnouncement
		err := workerServerOut.GetMessage(&announcement)
		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get messages from the worker server!"
				k.Payload = err
			})
		}
		announcements[i] = announcement
	}

	// we have the second transaction in the first epoch, which has 3 transfers in epoch and 2 in block
	// and the second transaction in the second, which has 3 transfers in epoch and 1 in block
	// if epochs are working properly we'd expect these to be the same
	assert.Equal(
		t,
		announcements[1][0].RandomPayouts,
		announcements[3][0].RandomPayouts,
	)
}
