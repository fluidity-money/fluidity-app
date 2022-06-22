package probability

import (
	"math/big"

	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
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

func getTestEmission(network string, token string, decimal uint) *worker.Emission {
	emission := worker.NewEthereumEmission()
	emission.Network = network
	emission.TokenDetails = token_details.New(token, int(decimal))
	return emission
}
