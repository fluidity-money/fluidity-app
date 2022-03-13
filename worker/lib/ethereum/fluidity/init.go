package fluidity

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(fluidityContractAbiString)

	var err error

	if fluidityContractAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
