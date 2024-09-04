// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package longtail

import (
	_ "embed"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	libEth "github.com/fluidity-money/fluidity-app/lib/types/ethereum"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

// Context for logging
const Context = "LONGTAIL"

//go:embed abi.json
var longtailBytes []byte

var longtailAbi ethAbi.ABI

// GetPositionLiquidity for a pool and position ID given
func GetPositionLiquidity(client *ethclient.Client, amm_, pool_ libEth.Address, id misc.BigInt) misc.BigInt {
	var (
		amm  = ethCommon.HexToAddress(amm_.String())
		pool = ethCommon.HexToAddress(pool_.String())
	)
	log.Debug(func(k *log.Log) {
		k.Context = Context

		k.Format(
			"Using the Longtail AMM pool %v to get a position's liquidity",
			pool,
		)

		k.Payload = id
	})

	resp, err := ethereum.StaticCall(
		client,
		amm,
		longtailAbi,
		"positionLiquidity8D11C045",
		pool,
		id,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to do a static call to positionLiquidity8D11C045! Pool address %v, id %v",
				pool,
				id,
			)

			k.Payload = err
		})
	}

	liquidity, ok := resp[0].(*big.Int)

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Format("Incorrect position liquidity type %T", resp[0])
		})
	}

	return misc.NewBigIntFromInt(*liquidity)
}
