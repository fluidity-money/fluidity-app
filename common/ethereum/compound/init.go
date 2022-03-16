package compound

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(cTokenContractAbiString)

	var err error

	if cTokenContractAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
