// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package uniswap_v3

import (
	_ "embed"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

// Context for logging
const Context = "UNISWAP_V3"

//go:embed uniswap-v3-abi.json
var uniswapV3AbiBytes []byte

//0x66e433B898e299cD16dD724e99E11EECb3cBd55c

var uniswapV3PoolAbi ethAbi.ABI

func calculatePrice(seconds int, firstTick, secondTick *big.Int) *big.Rat {
	tickDifference := new(big.Rat).Sub(new(big.Rat).SetInt(secondTick), new(big.Rat).SetInt(firstTick))

	averageTick := new(big.Rat).Quo(tickDifference, new(big.Rat).SetInt64(int64(seconds)))

	price := new(big.Rat).Mul(averageTick, averageTick)

	two192 := new(big.Int).SetInt64(2)
	two192.Exp(two192, new(big.Int).SetInt64(192), nil)

	return price.Quo(price, new(big.Rat).SetInt(two192))
}

// GetTwrpPrice from given seconds in the past til now. Using the Uniswap
// TWRP is safe for low-stakes pricing on assets that we can't determine
// the price for, but should be avoided in general. It's safer to use
// Chainlink where possible. This will only work for the current block, when
// normally several blocks could be scanned, so be careful when there's low liquidity.
func GetTwrpPrice(client *ethclient.Client, poolAddress ethCommon.Address, seconds int) *big.Rat {
	log.Debug(func(k *log.Log) {
		k.Context = Context

		k.Format(
			"Using the Uniswap V3 pool to get the price of the asset %v",
			poolAddress,
		)
	})

	secondsAgo := []*big.Int{
		new(big.Int).SetInt64(int64(seconds)), // from
		new(big.Int).SetInt64(0),              // to
	}

	resp, err := ethereum.StaticCall(client, poolAddress, uniswapV3PoolAbi, "observe", secondsAgo)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to do a static call to observe! Pool address %v, secondsAgo %v",
				poolAddress,
				secondsAgo,
			)

			k.Payload = err
		})
	}

	if l := len(resp); l != 2 {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to decode a observe call! Pool address %v, seconds ago %v",
				poolAddress,
				seconds,
			)

			k.Payload = fmt.Errorf("length is %v", l)
		})
	}

	tickCumulatives, ok := resp[0].([]*big.Int)

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to decode a observe call's results! Pool address %v, seconds ago %v",
				poolAddress,
				seconds,
			)

			k.Payload = fmt.Sprintf("expected type []*big.Int, got %T", resp[0])
		})
	}

	if l := len(tickCumulatives); l != 2 {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to decode a observe call! Pool address %v, seconds ago %v",
				poolAddress,
				seconds,
			)

			k.Payload = fmt.Errorf("not enough to responses %v", l)
		})
	}

	price := calculatePrice(seconds, tickCumulatives[0], tickCumulatives[1])

	return price
}

func GetTwrpPrice1Second(client *ethclient.Client, poolAddress ethCommon.Address)  *big.Rat {
	return GetTwrpPrice(client, poolAddress, 1)
}
