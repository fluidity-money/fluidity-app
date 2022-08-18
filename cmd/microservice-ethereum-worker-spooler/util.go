package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

// read a big.Rat that must exist from the environment
func ratFromEnvOrFatal(env string) *big.Rat {
	resString := util.GetEnvOrFatal(env)

	res := new(big.Rat)

	_, success := res.SetString(resString)

	if !success {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to parse %s as a rat reading env %s!",
				resString,
				env,
			)
		})
	}

	return res
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

	spooledRewards, err := ethereum.BatchWinningsByUser(transactions, token)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to batch rewards!"
			k.Payload = err
		})
	}

	rewards := make([]worker.EthereumSpooledRewards, 0)

	for _, reward := range spooledRewards {
		rewards = append(rewards, reward)
	}

	queue.SendMessage(queueName, rewards)
}
