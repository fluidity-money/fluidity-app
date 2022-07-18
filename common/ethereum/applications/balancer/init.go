package balancer

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(balancerV2VaultAbiString)

	var err error

	if balancerV2VaultAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(balancerV2PoolAbiString)

	if balancerV2PoolAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
