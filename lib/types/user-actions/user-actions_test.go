// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package user_actions

import (
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
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
	suite.ethSwap = NewSwapEthereum(
		network.NetworkEthereum,
		ethereum.AddressFromString("0xeE1234"),
		ethereum.HashFromString("0xeE11"),
		misc.BigIntFromInt64(123456789),
		true,
		"fTEST",
		6,
	)

	suite.solSwap = NewSwapSolana(
		"0xsOlAddR",
		"0xsOlHash",
		misc.BigIntFromInt64(123456789),
		true,
		"fTEST",
		6,
	)

	suite.ethSend = NewSendEthereum(
		network.NetworkEthereum,
		ethereum.AddressFromString("0xeE1122"),
		ethereum.AddressFromString("0xeE112233"),
		ethereum.HashFromString("0xeEeEeEeE"),
		misc.BigIntFromInt64(123456789),
		"fTEST",
		6,
		misc.BigIntFromInt64(1),
	)

	suite.solSend = NewSendSolana(
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
			"0x000000000000000000000000000000000000ee11",
			suite.ethSwap.TransactionHash,
			"Should convert transaction hash to lowercase!",
		)

		assert.Equal(
			t,
			"0x0000000000000000000000000000000000ee1234",
			suite.ethSwap.SenderAddress,
			"Should convert sender address to lowercase!",
		)

		assert.True(t, suite.ethSwap.IsSwap())
		assert.False(t, suite.ethSwap.IsSend())
	})

	suite.T().Run("TestEthereumSend", func(t *testing.T) {

		assert.Equal(
			t,
			"0x00000000000000000000000000000000eeeeeeee",
			suite.ethSend.TransactionHash,
			"Should convert transaction hash to lowercase!",
		)

		assert.Equal(
			t,
			"0x0000000000000000000000000000000000ee1122",
			suite.ethSend.SenderAddress,
			"Should convert sender address to lowercase!",
		)

		assert.Equal(
			t,
			"0x00000000000000000000000000000000ee112233",
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
