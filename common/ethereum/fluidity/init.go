package fluidity

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func ethAbiMustArgument(name, typ string) ethAbi.Argument {
	ethType, err := ethAbi.NewType(typ, typ, nil)

	if err != nil {
		panic(err)
	}

	arg := ethAbi.Argument{
		Name: name,
		Type: ethType,
	}

	return arg
}

func init() {
	reader := strings.NewReader(fluidityContractAbiString)

	var err error

	if fluidityContractAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
