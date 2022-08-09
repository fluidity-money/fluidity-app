package curve

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(curveAbiString)

	var err error

	if curveAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
