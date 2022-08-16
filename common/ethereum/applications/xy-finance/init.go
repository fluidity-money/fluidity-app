package xy_finance

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(xyFinanceAbiString)

	var err error

	if xyFinanceAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(ERC20AbiString)

	if erc20Abi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
