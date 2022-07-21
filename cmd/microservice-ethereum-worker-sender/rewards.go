// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"fmt"

	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

// callRewardArguments provided to callRewardFunction
type callRewardArguments struct {
	transactionOptions    *ethAbiBind.TransactOpts
	containerAnnouncement []worker.EthereumSpooledRewards
	contractAddress       ethCommon.Address
	client                *ethclient.Client
	useHardhatFix         bool
	hardcodedGasLimit     uint64
}

func callRewardFunction(arguments callRewardArguments) (*ethTypes.Transaction, error) {
	var (
		transactionOptions    = arguments.transactionOptions
		containerAnnouncement = arguments.containerAnnouncement
		contractAddress       = arguments.contractAddress
		client                = arguments.client
		useHardhatFix         = arguments.useHardhatFix
		hardcodedGasLimit     = arguments.hardcodedGasLimit
	)

	transactionOptions.GasLimit = hardcodedGasLimit

	if useHardhatFix {
		gasPriceTip, err := libEthereum.GetGasPriceTipHardhat(
			context.Background(),
			client,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to use the hardhat way of getting the gas price tip! %v",
				err,
			)
		}

		transactionOptions.GasTipCap = gasPriceTip
	}

	if !useHardhatFix && hardcodedGasLimit == 0 {
		err := libEthereum.UpdateGasAmounts(
			context.Background(),
			client,
			transactionOptions,
			800_000,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to update the gas amounts for calling the reward! %v",
				err,
			)
		}
	}

	transaction, err := fluidity.TransactBatchReward(
		client,
		contractAddress,
		transactionOptions,
		containerAnnouncement,
	)

	if err != nil {
		var transactionHashHex string

		if transaction != nil {
			transactionHashHex = transaction.Hash().Hex()
		}

		return nil, fmt.Errorf(
			"failed to call the reward contract function with transaction hash %#v! %v",
			transactionHashHex,
			err,
		)
	}

	return transaction, nil
}
