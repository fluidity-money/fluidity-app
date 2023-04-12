package main_test

import (
	"math/big"
	"testing"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/tests/pipeline/libtest"
	"github.com/stretchr/testify/assert"
)

const (
	// EnvWorkerServerIn to send messages to the worker server
	EnvWorkerServerIn = `FLU_ETHEREUM_WORK_QUEUE`

	// EnvWorkerServerOut to receive messages from the worker server
	EnvWorkerServerOut = `FLU_ETHEREUM_AMQP_QUEUE_NAME`
)


func TestPipelineUtilityGauges(t *testing.T) {
    var (
        workerServerInputQueue  = util.GetEnvOrFatal(EnvWorkerServerIn)
        workerServerOutputQueue = util.GetEnvOrFatal(EnvWorkerServerOut)

        transferSender    = libtest.RandomAddress()
        transferRecipient = libtest.RandomAddress()
    )

    logger := libtest.LogMessages(workerServerOutputQueue)

    time.Sleep(5 * time.Second)

    message := worker.EthereumHintedBlock{
    	BlockHash:             libtest.RandomHash(),
    	BlockBaseFee:          misc.BigIntFromInt64(100000000),
    	BlockTime:             100000000,
    	BlockNumber:           misc.BigIntFromInt64(100000000),
    	DecoratedTransactions: map[ethereum.Hash]worker.EthereumDecoratedTransaction{
            libtest.RandomHash(): {
            	Transaction: ethereum.Transaction{
            		BlockHash: libtest.RandomHash(),
            		Data:      []byte{},
            		GasFeeCap: misc.BigIntFromInt64(10000000),
            		GasTipCap: misc.BigIntFromInt64(10000000),
            		GasPrice:  misc.BigIntFromInt64(10000000),
            		Hash:      libtest.RandomHash(),
            		To:        libtest.RandomAddress(),
            		From:      libtest.RandomAddress(),
            		Type:      2,
            	},
            	Receipt:     ethereum.Receipt{
                    GasUsed: misc.BigIntFromInt64(100000),
                },
            	Transfers:   []worker.EthereumDecoratedTransfer{
                    {
                    	TransactionHash:  libtest.RandomHash(),
                    	SenderAddress:    transferSender,
                    	RecipientAddress: transferRecipient,
                    	Decorator:        &worker.EthereumWorkerDecorator{
                    		Application:    1,
                                UtilityName:    "",
                    		ApplicationFee: new(big.Rat).SetInt64(0),
                    	},
                    	AppEmissions:     worker.EthereumAppFees{},
                    },
                },
            },
        },
    }

    for k := range message.DecoratedTransactions {
        message.DecoratedTransactions[k].Transfers[0].Decorator.UtilityName = "90% utility"
    }

    queue.SendMessage(workerServerInputQueue, message)

    var announcements []worker.EthereumAnnouncement
    err := logger.GetMessage(&announcements)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to get messages from the worker!"
            k.Payload = err
        })
    }

    ninetyPercentFluidGovPayout1 := announcements[0].RandomPayouts[applications.UtilityFluidGov][0]

    for k := range message.DecoratedTransactions {
        message.DecoratedTransactions[k].Transfers[0].Decorator.UtilityName = "10% utility"
    }

    queue.SendMessage(workerServerInputQueue, message)

    err = logger.GetMessage(&announcements)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to get messages from the worker!"
            k.Payload = err
        })
    }

    tenPercentFluidGovPayout1 := announcements[0].RandomPayouts[applications.UtilityFluidGov][0]


    assert.Greater(t, ninetyPercentFluidGovPayout1.Usd, tenPercentFluidGovPayout1.Usd)
}
