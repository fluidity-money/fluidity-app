package main_test

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/tests/pipeline/libtest"

	ethApps "github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/queues/ethereum"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

)

func TestTransactionAttributes(t *testing.T) {
    var (
        spoolerInputQueue   = util.GetEnvOrFatal(EnvRewardsAmqpQueueName)
	logsQueue           = ethereum.TopicLogs

	blockNumInt = misc.BigIntFromInt64(69594075)
	// can't be random as it's also embedded in reward data
	senderAddress = ethTypes.AddressFromString("0x7a08eaa93c05abd6b86bb09b0f565d6fc499ee35")
	recipientAddress = libtest.RandomAddress()
	transactionHash = libtest.RandomHash()
	tokenDetails = token_details.New("fUSDT", 6)
	expectedAmount = misc.BigIntFromInt64(12500000)
	fusdtAddress = ethTypes.AddressFromString("0x737f9DC58538B222a6159EfA9CC548AB4b7a3F1e")
	topicReward = ethTypes.HashFromString("0xe417c38cb96e748006d0ef1a56fec0de428abac103b6644bc30c745f54f54345")
	topicWinner = ethTypes.HashFromString("0x0000000000000000000000007a08eaa93c05abd6b86bb09b0f565d6fc499ee35")
    )

    payouts := make(map[applications.UtilityName]worker.Payout)
    payouts["none"] = worker.Payout{Native: misc.BigIntFromInt64(10000000), Usd: 10}

    announcement := []worker.EthereumWinnerAnnouncement{{
    	Network:         network.NetworkEthereum,
    	TransactionHash: transactionHash,
    	BlockNumber:     &blockNumInt,
    	FromAddress:     senderAddress,
    	ToAddress:	 recipientAddress,
    	FromWinAmount:   payouts,
	// ignored
    	ToWinAmount:     payouts,
    	TokenDetails:	 tokenDetails,
    	Application:     0,
    }}

    queue.SendMessage(spoolerInputQueue, announcement)

    // payout, block numbers
    logData_ := "0x0000000000000000000000000000000000000000000000000000000000020f9c000000000000000000000000000000000000000000000000000000000425ebd5000000000000000000000000000000000000000000000000000000000425ebf9"
    logData, err := hexutil.Decode(logData_)
    require.NoError(t, err)
    data := misc.Blob(logData)

    log := ethereum.Log {
	Address: fusdtAddress,
	Topics: []ethTypes.Hash{topicReward,topicWinner}, 
	Data: data,
	BlockNumber : misc.BigIntFromInt64(1),
	TxHash: transactionHash,
	TxIndex: misc.BigIntFromInt64(1),
	BlockHash: ethTypes.HashFromString("0xabc"), 
	Index: misc.BigIntFromInt64(1),
	Removed: false,
    }

    // sleep between messages to avoid ordering issues
    time.Sleep(time.Second)

    // send message from track-winners -> track-transaction-attributes -> timescale
    queue.SendMessage(logsQueue, log)

    time.Sleep(time.Second)

    attributes := winners.GetTransactionAttributes(senderAddress)

    assert.Len(t, attributes, 1)
    expectedAttributes := winners.TransactionAttributes{
	Network: network.NetworkEthereum,
	Application: ethApps.ApplicationNone,
	TransactionHash: transactionHash.String(),
	Address: senderAddress.String(),
	Amount: expectedAmount,
	TokenDetails: tokenDetails,
    }

    assert.Equal(t, expectedAttributes, attributes[0])
}
