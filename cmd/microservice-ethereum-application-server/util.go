// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func getReceipt(gethClient *ethclient.Client, transactionHash ethereum.Hash) (*ethereum.Receipt, error) {
	txReceipt, err := gethClient.TransactionReceipt(
		context.Background(),
		ethCommon.HexToHash(transactionHash.String()),
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get the transaction receipt for Fluid transfer %#v! %w",
			transactionHash.String(),
			err,
		)
	}

	if txReceipt == nil {
		return nil, fmt.Errorf(
			"Receipt for fluid transfer %v was nil! %w",
			transactionHash,
			err,
		)
	}

	convertedReceipt := libEthereum.ConvertGethReceipt(*txReceipt)

	return &convertedReceipt, nil
}