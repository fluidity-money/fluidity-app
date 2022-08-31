// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package uniswap_anchored_view

import (
	"context"
	"fmt"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
)

const uniswapContractAbiString = `[
    {
      "inputs": [
        { "internalType": "string", "name": "symbol", "type": "string" }
      ],
      "name": "price",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
]`

// uniswapContractAbi set by init.go to generate the ABI code
var uniswapContractAbi ethAbi.ABI

func GetPrice(client *ethclient.Client, cTokenAddress ethCommon.Address, tokenSymbol string) (*big.Rat, error) {
	boundContract := ethAbiBind.NewBoundContract(
		cTokenAddress,
		uniswapContractAbi,
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
		"price",
		tokenSymbol,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to call the price function on Uniswap's anchored view at %#v! %v",
			cTokenAddress,
			err,
		)
	}

	amountRat, err := ethereum.CoerceBoundContractResultsToRat(results)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce the results from the uniswap anchored view price function to rat! %v",
			err,
		)
	}

	return amountRat, nil
}
