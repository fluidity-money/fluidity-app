package applications

import (
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/stretchr/testify/assert"
)

func TestGetApplicationFee(t *testing.T) {
	// Application fee functions are primarily tested in their own unit tests,
	// so only test whether they return as expected
	var (
		transfer           worker.EthereumApplicationTransfer
		client             *ethclient.Client
		fluidTokenContract common.Address
		tokenDecimals      int
	)

	fee, err := GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals)
	assert.Nil(t, fee)
	assert.Error(t, err)

	transfer.Application = ApplicationUniswapV2
	fee, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals)
	assert.Nil(t, fee)
	assert.Error(t, err)

	transfer.Application = ApplicationBalancerV2
	fee, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals)
	assert.Nil(t, fee)
	assert.Error(t, err)

	transfer.Application = ApplicationOneInchLPV1
	fee, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals)
	assert.Nil(t, fee)
	assert.Error(t, err)

	transfer.Application = ApplicationMooniswap
	fee, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals)
	assert.Nil(t, fee)
	assert.Error(t, err)

	transfer.Application = ApplicationOneInchFixedRateSwap
	fee, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals)
	assert.Nil(t, fee)
	assert.Error(t, err)
}

func TestGetApplicationTransferParties(t *testing.T) {
	var (
		transfer          worker.EthereumApplicationTransfer
		transactionSender = ethereum.AddressFromString("0x77")
		logAddress        = ethereum.AddressFromString("0x88")
	)

	sender, receiver, err := GetApplicationTransferParties(transfer)
	assert.Error(t, err)
	assert.Zero(t, sender)
	assert.Zero(t, receiver)

	transfer.Transaction.From = transactionSender
	transfer.Log.Address = logAddress
	transfer.Application = ApplicationMooniswap

	sender, receiver, err = GetApplicationTransferParties(transfer)
	assert.NoError(t, err)
	assert.Equal(t, transactionSender, sender)
	assert.Equal(t, logAddress, receiver)

	transfer.Application = ApplicationUniswapV2
	sender, receiver, err = GetApplicationTransferParties(transfer)
	assert.NoError(t, err)
	assert.Equal(t, transactionSender, sender)
	assert.Equal(t, logAddress, receiver)

	transfer.Application = ApplicationBalancerV2
	sender, receiver, err = GetApplicationTransferParties(transfer)
	assert.NoError(t, err)
	assert.Equal(t, transactionSender, sender)
	assert.Equal(t, logAddress, receiver)
}

func TestClassifyApplicationLogTopic(t *testing.T) {
	assert.Equal(
		t,
		ApplicationUniswapV2,
		ClassifyApplicationLogTopic(UniswapSwapLogTopic),
	)
	assert.Equal(
		t,
		ApplicationOneInchLPV1,
		ClassifyApplicationLogTopic(OneInchLPV1SwapLogTopic),
	)
	assert.Equal(
		t,
		ApplicationOneInchLPV2,
		ClassifyApplicationLogTopic(OneInchLPV2SwapLogTopic),
	)
	assert.Equal(
		t,
		ApplicationMooniswap,
		ClassifyApplicationLogTopic(MooniswapSwapLogTopic),
	)
	assert.Equal(
		t,
		ApplicationOneInchFixedRateSwap,
		ClassifyApplicationLogTopic(OneInchFixedRateSwapLogTopic),
	)
	assert.Equal(
		t,
		ApplicationBalancerV2,
		ClassifyApplicationLogTopic(BalancerSwapLogTopic),
	)
	assert.Equal(
		t,
		ApplicationNone,
		ClassifyApplicationLogTopic(""),
	)
	assert.Equal(
		t,
		ApplicationNone,
		ClassifyApplicationLogTopic("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"),
	)
}
