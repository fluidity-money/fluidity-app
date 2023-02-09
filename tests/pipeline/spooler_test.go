package main_test

import (
	"math"
	"math/big"
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	workerTypes "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/tests/pipeline/libtest"
	"github.com/stretchr/testify/assert"
)

const (
	// EnvRewardsAmqpQueueName is the queue the spooler receives winners from
	EnvRewardsAmqpQueueName = `FLU_ETHEREUM_WINNERS_AMQP_QUEUE_NAME`

	// EnvPublishAmqpQueueName is the queue the spooler posts batched winners down
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME`
)

var (
    Network = network.NetworkEthereum
    OneInt = big.NewInt(1)
)

type winnerGenerator struct {
    network network.BlockchainNetwork
    blockNumber *big.Int
    token token_details.TokenDetails
}

func (w *winnerGenerator) generateWinnerAnnouncement(from, to ethTypes.Address, fromWin, toWin map[applications.UtilityName]workerTypes.Payout) workerTypes.EthereumWinnerAnnouncement {
    w.blockNumber.Add(w.blockNumber, OneInt)

    blockNum := new(big.Int).Set(w.blockNumber)
    blockNumInt := misc.NewBigIntFromInt(*blockNum)

    return workerTypes.EthereumWinnerAnnouncement{
    	Network:         w.network,
    	TransactionHash: libtest.RandomHash(),
    	BlockNumber:     &blockNumInt,
    	FromAddress:     from,
    	ToAddress:       to,
    	FromWinAmount:   fromWin,
    	ToWinAmount:     toWin,
    	TokenDetails:    w.token,
    	Application:     0,
    }
}

func generateWinnings(token token_details.TokenDetails, usd float64, exchangeRate *big.Rat) (workerTypes.Payout, map[applications.UtilityName]workerTypes.Payout) {
    decimals := token.TokenDecimals

    usdRat := new(big.Rat).SetFloat64(usd)
    nativeRat := new(big.Rat).Quo(usdRat, exchangeRate)

    nativeInt := new(big.Int)
    // 1e(decimals)
    nativeInt.Exp(big.NewInt(10), big.NewInt(int64(decimals)), nil)
    // 1e(decimals) * num/denom
    nativeInt.Mul(nativeInt, nativeRat.Num())
    nativeInt.Quo(nativeInt, nativeRat.Denom())

    payout := workerTypes.Payout{
    	Native: misc.NewBigIntFromInt(*nativeInt),
    	Usd:    usd,
    }

    payoutMap := map[applications.UtilityName]workerTypes.Payout{
        applications.UtilityFluid: payout,
    }

    return payout, payoutMap
}

func TestSpooler(t *testing.T) {
    var (
        spoolerInputQueue   = util.GetEnvOrFatal(EnvRewardsAmqpQueueName)
        spoolerPublishQueue = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
    )

    logger := libtest.LogMessages(spoolerPublishQueue)

    var (
        config = worker.GetWorkerConfigEthereum(Network)

        instantRewardThreshold = config.SpoolerInstantRewardThreshold
        batchRewardThreshold   = config.SpoolerBatchedRewardThreshold
    )

    token := token_details.New("fTest", 6)

    generator := winnerGenerator{
    	network:     Network,
    	blockNumber: big.NewInt(10),
    	token: token,
    }

    var (
        from = libtest.RandomAddress()
        to   = libtest.RandomAddress()

        // 80%
        fromWinnings, fromWinningsMap = generateWinnings(token, instantRewardThreshold, big.NewRat(1, 1))
        // 20%
        toWinnings, toWinningsMap = generateWinnings(token, instantRewardThreshold/4, big.NewRat(1, 1))
    )

    winning := generator.generateWinnerAnnouncement(
        from,
        to,
        fromWinningsMap,
        toWinningsMap,
    )
    winnings := []workerTypes.EthereumWinnerAnnouncement { winning }

    // this should result in an instant payout
    queue.SendMessage(spoolerInputQueue, winnings)

    var spooledWinnings workerTypes.EthereumSpooledRewards

    err := logger.GetMessage(&spooledWinnings)

    assert.Nil(t, err)

    assert.Equal(t, spooledWinnings.Network, Network)
    assert.Equal(t, spooledWinnings.Token, token)
    assert.Equal(t, spooledWinnings.FirstBlock, winning.BlockNumber)
    assert.Equal(t, spooledWinnings.LastBlock, winning.BlockNumber)

    assert.Equal(t, len(spooledWinnings.Rewards), 1)
    fluidReward, exists := spooledWinnings.Rewards[applications.UtilityFluid]
    assert.Equal(t, exists, true)
    assert.Equal(t, len(fluidReward), 2)

    fromReward := fluidReward[from]
    toReward := fluidReward[to]

    assert.Equal(t, fromReward, fromWinnings.Native)
    assert.Equal(t, toReward, toWinnings.Native)

    // now try a batch payout

    batchAmount := math.Min(instantRewardThreshold, batchRewardThreshold) * 0.9

    rewardsNeeded := math.Ceil(batchRewardThreshold / batchAmount)

    totalRewardAmount := batchAmount * rewardsNeeded

    for i := 0; i < int(rewardsNeeded); i++ {
        var (
            from = libtest.RandomAddress()
            to   = libtest.RandomAddress()

            // 80%
            _, fromWinningsMap = generateWinnings(token, batchAmount*4/5, big.NewRat(1, 1))
            // 20%
            _, toWinningsMap = generateWinnings(token, batchAmount*1/5, big.NewRat(1, 1))
        )

        winning := generator.generateWinnerAnnouncement(
            from,
            to,
            fromWinningsMap,
            toWinningsMap,
        )
        winnings := []workerTypes.EthereumWinnerAnnouncement { winning }

        // this should result in an instant payout
        queue.SendMessage(spoolerInputQueue, winnings)
    }

    // we should have rewards now!
    err = logger.GetMessage(&spooledWinnings)

    assert.Nil(t, err)

    assert.Equal(t, Network, spooledWinnings.Network)
    assert.Equal(t, token, spooledWinnings.Token)

    nativePayout := new(misc.BigInt)
    expectedPayout, _ := generateWinnings(token, totalRewardAmount, big.NewRat(1, 1))

    for utility, rewardsMap := range spooledWinnings.Rewards {
        for _, payout := range rewardsMap {
            assert.Equal(t, applications.UtilityFluid, utility)
            nativePayout.Add(&nativePayout.Int, &payout.Int)
        }
    }

    assert.Equal(t, expectedPayout.Native, *nativePayout)

    // make sure we don't have any stray winnings

    err = logger.GetMessage(&spooledWinnings)

    assert.Equal(t, libtest.ErrNoMessages, err)
}
