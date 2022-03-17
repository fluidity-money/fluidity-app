package user_actions

import (
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type UserActionsTestSuite struct {
	suite.Suite
	ethSwap UserAction
	ethSend UserAction
	solSwap UserAction
	solSend UserAction
}

func (suite *UserActionsTestSuite) SetupTest() {
	suite.ethSwap = NewSwap(
		network.NetworkEthereum,
		"0xethAdDr",
		"0xethHash",
		misc.BigIntFromInt64(123456789),
		true,
		"fTEST",
		6,
	)

	suite.solSwap = NewSwap(
		network.NetworkSolana,
		"0xsOlAddR",
		"0xsOlHash",
		misc.BigIntFromInt64(123456789),
		true,
		"fTEST",
		6,
	)

	suite.ethSend = NewSend(
		network.NetworkEthereum,
		"0xethAdDrSender",
		"0xethAdDrRec",
		"0xethHash",
		misc.BigIntFromInt64(123456789),
		"fTEST",
		6,
	)

	suite.solSend = NewSend(
		network.NetworkSolana,
		"0xsOlAdDrSender",
		"0xsOlAdDrRec",
		"0xsOlHash",
		misc.BigIntFromInt64(123456789),
		"fTEST",
		6,
	)
}

func TestUserActionsTestSuite(t *testing.T) {
	suite.Run(t, new(UserActionsTestSuite))
}

func (suite *UserActionsTestSuite) TestSwap() {

	suite.T().Run("TestEthereumSwap", func(t *testing.T) {
		assert.Equal(
			t,
			"0xethhash",
			suite.ethSwap.TransactionHash,
			"Should convert transaction hash to lowercase!",
		)

		assert.Equal(
			t,
			"0xethaddr",
			suite.ethSwap.SenderAddress,
			"Should convert sender address to lowercase!",
		)

		assert.True(t, suite.ethSwap.IsSwap())
		assert.False(t, suite.ethSwap.IsSend())
	})

	suite.T().Run("TestEthereumSend", func(t *testing.T) {

		assert.Equal(
			t,
			"0xethhash",
			suite.ethSend.TransactionHash,
			"Should convert transaction hash to lowercase!",
		)

		assert.Equal(
			t,
			"0xethaddrsender",
			suite.ethSend.SenderAddress,
			"Should convert sender address to lowercase!",
		)

		assert.Equal(
			t,
			"0xethaddrrec",
			suite.ethSend.RecipientAddress,
			"Should convert recipient address to lowercase!",
		)

		assert.False(t, suite.ethSend.IsSwap())
		assert.True(t, suite.ethSend.IsSend())
	})

	suite.T().Run("TestSolanaSwap", func(t *testing.T) {

		assert.Equal(
			t,
			"0xsOlHash",
			suite.solSwap.TransactionHash,
			"Should preserve case of Solana transaction hash!",
		)

		assert.Equal(
			t,
			"0xsOlAddR",
			suite.solSwap.SenderAddress,
			"Should preserve case of Solana sender address!",
		)

		assert.True(t, suite.ethSwap.IsSwap())
		assert.False(t, suite.ethSwap.IsSend())
	})

	suite.T().Run("TestSolanaSend", func(t *testing.T) {

		assert.Equal(
			t,
			"0xsOlHash",
			suite.solSend.TransactionHash,
			"Should preserve case of Solana transaction hash!",
		)

		assert.Equal(
			t,
			"0xsOlAdDrSender",
			suite.solSend.SenderAddress,
			"Should preserve case of Solana sender address!",
		)

		assert.Equal(
			t,
			"0xsOlAdDrRec",
			suite.solSend.RecipientAddress,
			"Should preserve case of Solana sender address!",
		)

		assert.False(t, suite.solSend.IsSwap())
		assert.True(t, suite.solSend.IsSend())
	})
}
