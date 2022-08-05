package dodo

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(DodoV2SwapAbiString)

	var err error

	if dodoV2SwapAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(ERC20AbiString)

	if erc20Abi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(DodoV1SwapAbiString)

	if dodoV1SwapAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
