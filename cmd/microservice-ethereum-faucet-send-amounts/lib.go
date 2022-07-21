// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"fmt"
	"math/big"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	ethFluidity "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
)

// callTransferFunction to first check for hardhat-specific transaction setup, before making the tranfer
func callTransferFunction(ethClient *ethclient.Client, tokenAddress, ethAddress ethCommon.Address, amount *big.Int, transferOpts *ethAbiBind.TransactOpts, useHardhatFix bool, hardcodedGasLimit uint64) (*types.Transaction, error) {

	transferOpts.GasLimit = hardcodedGasLimit

	if useHardhatFix {
		gasPriceTip, err := ethFluidity.GetGasPriceTipHardhat(
			context.Background(),
			ethClient,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to use the hardhat way of getting the gas price tip! %v",
				err,
			)
		}

		transferOpts.GasTipCap = gasPriceTip
	}

	if !useHardhatFix && hardcodedGasLimit == 0 {
		err := ethFluidity.UpdateGasAmounts(
			context.Background(),
			ethClient,
			transferOpts,
			800_000,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to update the gas amounts for calling the reward! %v",
				err,
			)
		}
	}

	transaction, err := fluidity.TransactTransfer(
		ethClient,
		tokenAddress,
		ethAddress,
		amount,
		transferOpts,
	)

	if err != nil {
		return nil, err
	}

	return transaction, nil
}
