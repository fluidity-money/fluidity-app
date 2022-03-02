package ethereum

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

func debug(format string, content ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Format(format, content...)
	})
}

func bigIntFromUint64(x uint64) (int *big.Int) {
	int = new(big.Int)

	int.SetUint64(x)

	return
}
