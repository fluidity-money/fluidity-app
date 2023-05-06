package fluidity

import (
	"math/big"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/stretchr/testify/assert"
)

func TestBatchReward(t *testing.T) {
	testRewardBatch := []abiFluidityReward{
		{
			ClientName: string(applications.UtilityFluid),
			Winners: []abiWinner{
				{
					Winner:    common.HexToAddress("0x6221A9c005F6e47EB398fD867784CacfDcFFF4E7"),
					WinAmount: big.NewInt(100),
				},
			},
		},
	}

	_, err := ExecutorAbi.Pack(
		"reward",
		common.HexToAddress("0xt0k3n"),
		testRewardBatch,
		big.NewInt(1),
		big.NewInt(10),
	)

	assert.NoError(
		t,
		err,
		"Failed to pack fluidity reward args!",
	)
}
