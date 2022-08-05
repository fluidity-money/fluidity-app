package dodo

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(DodoSwapAbiString)

	var err error

	if oneInchLiquidityPoolV2Abi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(fixedRateSwapAbiString)

	if fixedRateSwapAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(mooniswapPoolV1AbiString)

	if mooniswapPoolV1Abi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
