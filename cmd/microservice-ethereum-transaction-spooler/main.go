package main

import (
	"math/big"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
    // EnvRewardsAmqpQueueName is the queue to post winners down
    EnvRewardsAmqpQueueName = `FLU_ETHEREUM_WINNERS_AMQP_QUEUE_NAME`

    // EnvPublishAmqpQueueName is the queue to post batched winners down
    EnvPublishAmqpQueueName = `FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME`

    EnvInstantRewardThreshhold = `FLU_ETHEREUM_SPOOLER_INSTANT_REWARD_THRESHHOLD`

    EnvTotalRewardThreshhold = `FLU_ETHEREUM_SPOOLER_TOTAL_REWARD_THRESHHOLD`
)

func intFromEnvOrFatal(env string) int64 {
    resString := util.GetEnvOrFatal(env)

    res, err := strconv.Atoi(resString)

    if err != nil {
        log.Fatal(func (k *log.Log) {
            k.Format(
                "Failed to parse %s as an int reading env %s!",
                resString,
                env,
            )
            k.Payload = err
        })
    }

    return int64(res)
}

func sendRewards(queueName string, token token_details.TokenDetails) {
    transactions := spooler.GetAndRemoveRewardsForToken(token)

    queue.SendMessage(queueName, transactions)
}

func main() {
    var (
        rewardsQueue = util.GetEnvOrFatal(EnvRewardsAmqpQueueName)
        batchedRewardsQueue = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
        instantRewardTreshhold = intFromEnvOrFatal(EnvInstantRewardThreshhold)
        totalRewardTreshhold = intFromEnvOrFatal(EnvTotalRewardThreshhold)
    )

    queue.GetMessages(rewardsQueue, func (message queue.Message) {
        var announcement worker.EthereumWinnerAnnouncement

        message.Decode(&announcement)

        spooler.InsertPendingWinner(announcement)

        var (
            winAmount = announcement.WinAmount
            tokenDetails = announcement.TokenDetails
            tokenDecimals = tokenDetails.TokenDecimals
        )


        tokenDecimalsNum := new(big.Int).Exp(big.NewInt(10), big.NewInt(int64(tokenDecimals)), nil)

        scaledWinAmount := new(misc.BigInt).Div(&winAmount.Int, tokenDecimalsNum)

        log.Debug(func (k *log.Log) {
            k.Format(
                "Reward value is $%s, instant send threshhold is $%d.",
                scaledWinAmount.String(),
                instantRewardTreshhold,
            )
        })

        if scaledWinAmount.Int64() >= instantRewardTreshhold {
            log.Debug(func (k *log.Log) {
                k.Message = "Transaction won more than instant send thresshold, sending instantly!"
            })
            sendRewards(batchedRewardsQueue, tokenDetails)

            return
        }

        log.Debug(func (k *log.Log) {
            k.Message = "Transaction won less than instant send thresshold, not sending yet!"
        })

        totalRewards := spooler.UnpaidWinningsForToken(tokenDetails)

        scaledTotalRewards := new(big.Int).Div(totalRewards, tokenDecimalsNum)

        log.Debug(func (k *log.Log) {
            k.Format(
                "Total pending rewards are $%s, threshhold is $%d.",
                scaledTotalRewards.String(),
                totalRewardTreshhold,
            )
        })

        if scaledTotalRewards.Int64() >= totalRewardTreshhold {
            log.Debug(func (k *log.Log) {
                k.Message = "Total pending rewards are greater than thresshold, sending!"
            })
            sendRewards(batchedRewardsQueue, tokenDetails)

            return
        }

        log.Debug(func (k *log.Log) {
            k.Message = "Total pending rewards are less than threshhold, not sending yet!"
        })
    })
}
