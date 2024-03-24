// Copyright 2024 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package prize_pool

import (
	"context"
	"fmt"
	"strconv"

	"github.com/fluidity-money/sui-go-sdk/models"
	"github.com/fluidity-money/sui-go-sdk/sui"
)

// GetMintSupply fetches the supply of a token via its mint address (unscaled)
func GetMintSupply(client sui.ISuiAPI, coinType string) (uint64, error) {
	res, err := client.SuiXGetTotalSupply(
		context.Background(),
		models.SuiXGetTotalSupplyRequest{CoinType: coinType},
	)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to get fluid token supply! %v",
			err,
		)
	}

	amountString := res.Value

	amount, err := strconv.ParseUint(amountString, 10, 64)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to parse token supply amount '%s': %v!",
			amountString,
			err,
		)
	}

	return amount, nil
}

// TODO cache with redis
// GetVaultBalance fetches the balance of a UserVault, ProtocolVault, or CoinReserve
func GetVaultBalance(client sui.ISuiAPI, vaultObjectId string) (uint64, error) {
	response, err := client.SuiGetObject(context.Background(), models.SuiGetObjectRequest{
		ObjectId: vaultObjectId,
		Options: models.SuiObjectDataOptions{
			ShowContent: true,
		},
	})
	if err != nil {
		return 0, fmt.Errorf(
			"failed to fetch balance of vault with id %v - %v",
			vaultObjectId,
			err,
		)
	}

	balanceString, ok := response.Data.Content.Fields["balance"].(string)
	if !ok {
		return 0, fmt.Errorf(
			"failed to parse vault balance as string! Value was %v",
			response.Data.Content.Fields["balance"],
		)
	}

	balance, err := strconv.ParseUint(balanceString, 10, 64)
	if err != nil {
		return 0, fmt.Errorf(
			"failed to fetch parse string %v to uint64 - %v",
			balanceString,
			err,
		)
	}

	return balance, nil
}
