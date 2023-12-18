// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package chainlink

import (
	"math/big"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"

	"github.com/ethereum/go-ethereum/ethclient"
)

type request struct {
	client           *ethclient.Client
	priceFeedAddress ethCommon.Address
	resp             chan *big.Rat
}

// decimalsServer to respond to requests with cached (or not, looked up)
// responses
var decimalsServer = make(chan request)

func startDecimalsServer() {
	decimalsCache := make(map[ethCommon.Address]*big.Rat)

	for request := range decimalsServer {
		var (
			client           = request.client
			priceFeedAddress = request.priceFeedAddress
			respChan         = request.resp
		)

		decimals, exists := decimalsCache[priceFeedAddress]

		if exists {
			respChan <- decimals
			continue
		}

		decimalsRes, err := ethereum.StaticCall(
			client,
			priceFeedAddress,
			priceFeedAbi,
			"decimals",
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to static call feed address %v",
					priceFeedAddress,
				)

				k.Payload = err
			})
		}

		decimals_, err := ethereum.CoerceBoundContractResultsToUint8(decimalsRes)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to read decimals result for price feed address %v",
					priceFeedAddress,
				)

				k.Payload = err
			})
		}

		ten := big.NewRat(10, 1)

		decimals = ethereum.BigPow(ten, int(decimals_))
		decimalsCache[priceFeedAddress] = decimals

		respChan <- decimals
	}
}
