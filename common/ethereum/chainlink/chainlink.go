// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package chainlink

import (
	"fmt"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

// Context to use for logging
const Context = "CHAINLINK"

const chainlinkPriceFeedAbiString = `[
	{
		"inputs": [],
		"name": "latestRoundData",
		"outputs": [
		{
			"internalType": "uint80",
			"name": "roundID",
			"type": "uint80"
		},
		{
			"internalType": "int256",
			"name": "price",
			"type": "int256"
		},
		{
			"internalType": "uint256",
			"name": "startedAt",
			"type": "uint256"
		},
		{
			"internalType": "uint256",
			"name": "timeStamp",
			"type": "uint256"
		},
		{
			"internalType": "uint80",
			"name": "answeredInRound",
			"type": "uint80"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
		{
			"internalType": "uint8",
			"name": "decimals",
			"type": "uint8"
		}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`

var priceFeedAbi ethAbi.ABI

// GetPrice using a Chainlink feed, caching the results in an internal
// server to make it thread safe
func GetPrice(client *ethclient.Client, priceFeedAddress ethCommon.Address) (*big.Rat, error) {
	log.Debug(func(k *log.Log) {
		k.Context = Context

		k.Format(
			"Using the Chainlink decimals cache to look up decimals for price feed %v",
			priceFeedAddress,
		)
	})

	resp := make(chan *big.Rat)

	decimalsServer <- request{
		client:           client,
		priceFeedAddress: priceFeedAddress,
		resp:             resp,
	}

	decimals := <-resp

	priceRes, err := ethereum.StaticCall(
		client,
		priceFeedAddress,
		priceFeedAbi,
		"latestRoundData",
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get latestRoundData! %w",
			err,
		)
	}

	if count := len(priceRes); count != 5 {
		return nil, fmt.Errorf(
			"returned results for latestRoundData did not have length of 5! was %v",
			count,
		)
	}

	price, ok := priceRes[1].(*big.Int)

	if !ok {
		return nil, fmt.Errorf(
			"failed to read a *big.Int from the result of latestRoundData!",
		)
	}

	priceRat := new(big.Rat).SetInt(price)

	priceRat.Quo(priceRat, decimals)

	return priceRat, nil
}
