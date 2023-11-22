package amm

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(ammAbiString)

	var err error

	AmmAbi, err = ethAbi.JSON(reader)

	if err != nil {
		panic(err)
	}
}
