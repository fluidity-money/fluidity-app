package fluidity

import (
	"math/big"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/stretchr/testify/assert"
)

func TestBatchReward(t *testing.T) {
	testRewardBatch := []RewardArg{
		{
			Winner:     common.HexToAddress("0x6221A9c005F6e47EB398fD867784CacfDcFFF4E7"),
			WinAmount:  big.NewInt(100),
		},
	}

	_, err := fluidityContractAbi.Pack(
		"batchReward",
		testRewardBatch,
		big.NewInt(1),
		big.NewInt(10),
	)

	assert.NoError(
		t,
		err,
		"Failed to pack fluidity batchReward args!",
	)
}
