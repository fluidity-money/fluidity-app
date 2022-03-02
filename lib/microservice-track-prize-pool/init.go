package microservice_track_prize_pool

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(rewardPoolAbiString)

	var err error

	if rewardPoolAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
