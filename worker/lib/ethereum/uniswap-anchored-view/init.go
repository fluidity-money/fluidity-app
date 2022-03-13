package uniswap_anchored_view

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(uniswapContractAbiString)

	var err error

	if uniswapContractAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
