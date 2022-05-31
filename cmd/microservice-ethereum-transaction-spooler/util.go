package main

import (
	"math/big"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

// read an int64 that must exist from the environment
func intFromEnvOrFatal(env string) int64 {
	resString := util.GetEnvOrFatal(env)

	res, err := strconv.Atoi(resString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
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

// calculates 10^x as a bigint (for token decimals)
func bigExp10(val int64) *big.Int {
	res := new(big.Int)

	ten := big.NewInt(10)

	exp := big.NewInt(val)

	res.Exp(ten, exp, nil)

	return res
}

// flushes the reward queue and sends the batched reward
func sendRewards(queueName string, token token_details.TokenDetails) {
	transactions := spooler.GetAndRemoveRewardsForToken(token)

	winnings := make(map[ethereum.Address]worker.EthereumSpooledRewards)

	for _, transaction := range transactions {
		var (
			winner = transaction.Winner
			amount = transaction.WinAmount
			block = transaction.BlockNumber

			amountInt = &amount.Int
		)

		reward, exists := winnings[winner]

		if !exists {
			reward = worker.EthereumSpooledRewards {
				Token: token,
				Winner: winner,
				WinAmount: new(misc.BigInt),
				FirstBlock: new(misc.BigInt),
				LastBlock: new(misc.BigInt),
			}
			reward.FirstBlock.Set(&block.Int)
		}

		reward.WinAmount.Add(&reward.WinAmount.Int, amountInt)

		if block.Cmp(&reward.FirstBlock.Int) < 0 {
			// block is less than reward.firstBlock
			reward.FirstBlock = block
		}

		if block.Cmp(&reward.LastBlock.Int) > 0 {
			// block is greater than the last block
			reward.LastBlock = block
		}

		winnings[winner] = reward
	}

	spooledRewards := make([]worker.EthereumSpooledRewards, 0)

	for _, reward := range(winnings) {
		spooledRewards = append(spooledRewards, reward)
	}

	queue.SendMessage(queueName, spooledRewards)
}
