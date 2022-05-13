package flux

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(fluxContractAbiString)

	var err error

	if fluxContractAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
