package uniswap

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(uniswapV2PairAbiString)

	var err error

	if uniswapV2PairAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
