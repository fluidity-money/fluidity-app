package main_test

import (
	"fmt"
	"math/rand"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/ethereum/go-ethereum/common/hexutil"
	lootboxes_db "github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/tests/pipeline/libtest"

	"github.com/fluidity-money/fluidity-app/lib/queues/ethereum"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

// create log data - payout, first block, last block
func createLogData(firstBlock, lastBlock int64) (misc.Blob, error) {
	const zeroData = "0000000000000000000000000000000000000000000000000000000000000000"

	firstBlockHex := fmt.Sprintf("%x", firstBlock)
	lastBlockHex := fmt.Sprintf("%x", lastBlock)

	// hex encode blocks and pad length
	firstBlockData := zeroData[:64-len(firstBlockHex)] + firstBlockHex
	lastBlockData := zeroData[:64-len(lastBlockHex)] + lastBlockHex

	// payout is read from database, so it can be zero
	logData_ := "0x" + zeroData + firstBlockData + lastBlockData
	logData, err := hexutil.Decode(logData_)

	if err != nil {
		return nil, err
	}

	data := misc.Blob(logData)

	return data, nil
}

func TestTransactionAttributes(t *testing.T) {
	var (
		spoolerInputQueue = util.GetEnvOrFatal(EnvRewardsAmqpQueueName)
		logsQueue         = ethereum.TopicLogs

		// can't be random as it's also embedded in reward data
		senderAddress        = ethTypes.AddressFromString("0x7a08eaa93c05abd6b86bb09b0f565d6fc499ee35")
		recipientAddress     = libtest.RandomAddress()
		transactionHash      = libtest.RandomHash()
		tokenDetails         = token_details.New("fUSDT", 6)
		expectedVolume       = misc.BigIntFromInt64(12500000)
		expectedRewardTier   = 1
		expectedLootboxCount = 1.0
		fusdtAddress         = ethTypes.AddressFromString("0x737f9DC58538B222a6159EfA9CC548AB4b7a3F1e")
		topicReward          = ethTypes.HashFromString("0xe417c38cb96e748006d0ef1a56fec0de428abac103b6644bc30c745f54f54345")
		topicWinner          = ethTypes.HashFromString("0x0000000000000000000000007a08eaa93c05abd6b86bb09b0f565d6fc499ee35")

		firstBlock  = rand.Int63n(1000)
		lastBlock   = rand.Int63n(1002 + firstBlock)
		blockNumInt = misc.BigIntFromInt64(firstBlock + 1)
	)

	payouts := make(map[applications.UtilityName]worker.Payout)
	payouts["none"] = worker.Payout{Native: misc.BigIntFromInt64(10000000), Usd: 10}

	announcement := []worker.EthereumWinnerAnnouncement{{
		Network:         network.NetworkEthereum,
		TransactionHash: transactionHash,
		BlockNumber:     &blockNumInt,
		FromAddress:     senderAddress,
		ToAddress:       recipientAddress,
		FromWinAmount:   payouts,
		// ignored
		ToWinAmount:  payouts,
		TokenDetails: tokenDetails,
		Application:  0,
	}}

	queue.SendMessage(spoolerInputQueue, announcement)

	logData, err := createLogData(firstBlock, lastBlock)
	require.NoError(t, err)

	log := ethereum.Log{
		Address:     fusdtAddress,
		Topics:      []ethTypes.Hash{topicReward, topicWinner},
		Data:        logData,
		BlockNumber: misc.BigIntFromInt64(1),
		TxHash:      transactionHash,
		TxIndex:     misc.BigIntFromInt64(1),
		BlockHash:   ethTypes.HashFromString("0xabc"),
		Index:       misc.BigIntFromInt64(1),
		Removed:     false,
	}

	// sleep between messages to avoid ordering issues
	time.Sleep(time.Second)

	// send message from track-winners -> track-transaction-attributes -> timescale
	queue.SendMessage(logsQueue, log)

	time.Sleep(time.Second)

	allLootboxes := lootboxes_db.GetLootboxes(senderAddress, 1)

	assert.Len(t, allLootboxes, 1)
	expectedLootbox := lootboxes.Lootbox{
		Address:         senderAddress.String(),
		Source:          lootboxes.Transaction,
		TransactionHash: transactionHash.String(),
		AwardedTime:     time.Now(),
		Volume:          expectedVolume,
		RewardTier:      expectedRewardTier,
		LootboxCount:    expectedLootboxCount,
	}

	assert.Equal(t, expectedLootbox, allLootboxes[0])
}
