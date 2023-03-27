// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
		receipt            ethereum.Receipt
		client             *ethclient.Client
		fluidTokenContract common.Address
		tokenDecimals      int
	)

	fee, emission, err := GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals, receipt)
	assert.Nil(t, fee)
	assert.Zero(t, emission)
	assert.Error(t, err)

	transfer.Application = ApplicationUniswapV2
	fee, emission, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals, receipt)
	assert.Nil(t, fee)
	assert.Zero(t, emission)
	assert.Error(t, err)

	transfer.Application = ApplicationBalancerV2
	fee, emission, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals, receipt)
	assert.Nil(t, fee)
	assert.Zero(t, emission)
	assert.Error(t, err)

	transfer.Application = ApplicationOneInchLPV1
	fee, emission, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals, receipt)
	assert.Nil(t, fee)
	assert.Zero(t, emission)
	assert.Error(t, err)

	transfer.Application = ApplicationMooniswap
	fee, emission, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals, receipt)
	assert.Nil(t, fee)
	assert.Zero(t, emission)
	assert.Error(t, err)

	transfer.Application = ApplicationOneInchFixedRateSwap
	fee, emission, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals, receipt)
	assert.Nil(t, fee)
	assert.Zero(t, emission)
	assert.Error(t, err)

	transfer.Application = ApplicationCurve
	fee, emission, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals, receipt)
	assert.Nil(t, fee)
	assert.Zero(t, emission)
	assert.Error(t, err)

	transfer.Application = ApplicationMultichain
	fee, emission, err = GetApplicationFee(transfer, client, fluidTokenContract, tokenDecimals, receipt)
	assert.Nil(t, fee)
	assert.Zero(t, emission)
	assert.Error(t, err)
}

func TestGetApplicationTransferParties(t *testing.T) {
	var (
		transfer          worker.EthereumApplicationTransfer
		transaction       ethereum.Transaction
		transactionSender = ethereum.AddressFromString("0x77")
		logAddress        = ethereum.AddressFromString("0x88")
	)

	sender, receiver, err := GetApplicationTransferParties(transaction, transfer)
	assert.Error(t, err)
	assert.Zero(t, sender)
	assert.Zero(t, receiver)

	transaction.From = transactionSender
	transfer.Log.Address = logAddress
	transfer.Application = ApplicationMooniswap

	sender, receiver, err = GetApplicationTransferParties(transaction, transfer)
	assert.NoError(t, err)
	assert.Equal(t, transactionSender, sender)
	assert.Equal(t, logAddress, receiver)

	transfer.Application = ApplicationUniswapV2
	sender, receiver, err = GetApplicationTransferParties(transaction, transfer)
	assert.NoError(t, err)
	assert.Equal(t, transactionSender, sender)
	assert.Equal(t, logAddress, receiver)

	transfer.Application = ApplicationBalancerV2
	sender, receiver, err = GetApplicationTransferParties(transaction, transfer)
	assert.NoError(t, err)
	assert.Equal(t, transactionSender, sender)
	assert.Equal(t, logAddress, receiver)

	transfer.Application = ApplicationCurve
	sender, receiver, err = GetApplicationTransferParties(transaction, transfer)
	assert.NoError(t, err)
	assert.Equal(t, transactionSender, sender)
	assert.Equal(t, logAddress, receiver)

	transfer.Application = ApplicationMultichain
	sender, receiver, err = GetApplicationTransferParties(transaction, transfer)
	assert.NoError(t, err)
	assert.Equal(t, transactionSender, sender)
	assert.Equal(t, logAddress, receiver)
}
