package addresslinker

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(addressConfirmerAbiString)

	var err error

	AddressConfirmerAbi, err = ethAbi.JSON(reader)

	if err != nil {
		panic(err)
	}
}
