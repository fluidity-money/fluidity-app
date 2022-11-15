// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"
	"context"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/log/discord"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
)

func updateMintLimits(ethClient *ethclient.Client, transactOpts *ethAbiBind.TransactOpts, contractAddress ethCommon.Address, globalMintLimit, userMintLimit *big.Int) {
	transaction, err := fluidity.TransactUpdateMintLimits(
		ethClient,
		contractAddress,
		globalMintLimit,
		userMintLimit,
		transactOpts,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to update the mint limits!"
			k.Payload = err
		})
	}

	transactionHash := transaction.Hash().Hex()

	discord.Notify(
		discord.SeverityAlarm,
		"Updated mint limits for %v transaction %v, waiting to be mined!",
		contractAddress,
		transactionHash,
	)

	_, err = ethAbiBind.WaitMined(context.Background(), ethClient, transaction)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to get transaction hash %v mined!",
				transactionHash,
			)

			k.Payload = err
		})
	}

	discord.Notify(
		discord.SeverityAlarm,
		"Contract %v transaction %v mined!",
		contractAddress,
		transactionHash,
	)

	log.App(func(k *log.Log) {
		k.Format(
			"Updated mint limits, transaction %v",
			transactionHash,
		)
	})
}
