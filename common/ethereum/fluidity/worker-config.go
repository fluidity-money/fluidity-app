// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

import (
	"context"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func GetTokenWorkerConfig(client *ethclient.Client, workerConfigAddress, tokenAddress ethCommon.Address) (*worker.WorkerConfigEthereum, error) {
	boundContract := ethAbiBind.NewBoundContract(
		workerConfigAddress,
		WorkerConfigAbi,
		client,
		client,
		client,
	)

	opts := ethAbiBind.CallOpts{
		Pending: false,
		Context: context.Background(),
	}

	var results []interface{}

	err := boundContract.Call(
		&opts,
		&results,
		"getTrfConfiguration",
		tokenAddress,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to call rewardPoolAmount on the WorkerConfig contract at address %#v: %v",
			workerConfigAddress,
			err,
		)
	}

	if len(results) != 7 {
		return nil, fmt.Errorf(
			"failed to coerce results into the expected workerconfig at address %#v: %v",
			workerConfigAddress,
			err,
		)
	}

	var (
		workerConfig worker.WorkerConfigEthereum
		ok bool
	)

	workerConfig.CompoundBlocksPerDay, ok = results[0].(uint8)

	if !ok {
		return nil, fmt.Errorf(
			"failed to coerce results[0] to compound blocks per day, was %#v",
			results[0],
		)
	}

	workerConfig.DefaultSecondsSinceLastBlock, ok = results[1].(uint8)

	if !ok {
		return nil, fmt.Errorf(
			"failed to coerce results[1] to default seconds since last block, was %#v",
			results[1],
		)
	}

	workerConfig.AtxBufferSize, ok = results[2].(uint8)

	if !ok {
		return nil, fmt.Errorf(
			"failed to coerce results[2] to the atx buffer size, was %#v",
			results[2],
		)
	}

	workerConfig.CurrentAtxTransactionMargin, ok = results[3].(uint8)

	if !ok {
		return nil, fmt.Errorf(
			"failed to coerce results[3] to the current atx transaction margin, was %#v",
			results[3],
		)
	}

	workerConfig.DefaultTransfersInBlock, ok = results[4].(uint8)

	if !ok {
		return nil, fmt.Errorf(
			"failed to coerce results[3] to the current atx buffer margin, was %#v",
			results[3],
		)
	}

	workerConfig.SpoolerInstantRewardThreshold, ok = results[5].(*big.Int)

	if !ok {
		return nil, fmt.Errorf(
			"failed to coerce results[5] to the spooler instant reward threshold, was %#v",
			results[5],
		)
	}

	workerConfig.SpoolerBatchedRewardThreshold, ok = results[6].(*big.Int)

	if !ok {
		return nil, fmt.Errorf(
			"failed to coerce results[6] to the spooler batched reward threshold, was %#v",
			results[6],
		)
	}

	return &workerConfig, nil
}
