package probability

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

func intToRat(x int) *big.Rat {
	var r big.Rat

	return r.SetInt64(int64(x))
}

func ratFromInt64(x int64) *big.Rat {
	var r big.Rat

	return r.SetInt64(x)
}

func uint64ToRat(x uint64) *big.Rat {
	var r big.Rat

	return r.SetUint64(x)
}

func debug(format string, arguments ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Format(format, arguments...)
	})
}
