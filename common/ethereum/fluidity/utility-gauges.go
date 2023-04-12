// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

import (
	"context"
	"fmt"
	"math/big"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
)

// GetGovTokenFrac gets the scaling fraction that should
// be applied to the gov token's distribution pool
func GetGovTokenFrac(client *ethclient.Client, utilGaugesAddress, contractAddress ethCommon.Address, utility applications.UtilityName) (*big.Rat, error) {
	boundContract := ethAbiBind.NewBoundContract(
		utilGaugesAddress,
		UtilityGaugesAbi,
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
		"getWeight",
		contractAddress,
		utility,
	)

	if err != nil {
		return nil, err
	}

	resultsRat, err := ethereum.CoerceBoundContractResultsToRats(results)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to read rats from the getWeight call! %+v",
			err,
		)
	}

	frac := new(big.Rat).Quo(resultsRat[0], resultsRat[1])

	return frac, nil
}
