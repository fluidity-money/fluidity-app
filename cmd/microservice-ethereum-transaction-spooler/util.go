package main

import (
	"math/big"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
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
func sendRewards(queueName string, shortName string) {
	transactions := spooler.GetAndRemoveRewardsForToken(shortName)

	queue.SendMessage(queueName, transactions)
}
