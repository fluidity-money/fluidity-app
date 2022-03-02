package main

import (
	"encoding/json"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/state"
	"math/big"
)

func redisGetLastBlock() uint64 {
	bytes := state.Get(RedisBlockKey)

	// if the returned bytes are nil, we haven't seen anything so
	// far!

	if len(bytes) == 0 {
		return 0
	}

	var int uint64

	err := json.Unmarshal(bytes, &int)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to get the last block to start!"
			k.Payload = err
		})
	}

	return int
}

func newBig(x uint64) *big.Int {
	var int big.Int

	int.SetUint64(x)

	return &int
}

func writeLastBlock(lastBlock uint64) {
	state.Set(RedisBlockKey, lastBlock)
}

func debug(message string, content ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Format(message, content...)
	})
}
