// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum/chainlink"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/airdrop"
	"github.com/fluidity-money/fluidity-app/lib/log"
	ethLogs "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvChainlinkEthPriceFeed to get the price of eth in usd from
	EnvChainlinkEthPriceFeed = `FLU_ETHEREUM_CHAINLINK_ETH_FEED_ADDR`
)

func main() {
	var (
		gethHttpUrl		     = util.PickEnvOrFatal(EnvEthereumHttpUrl)
		wethPriceFeedAddress = mustEthereumAddressFromEnv(EnvChainlinkEthPriceFeed)
	)

	ethClient, err := ethclient.Dial(gethHttpUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	ethLogs.Logs(func(l ethLogs.Log) {

		wethPriceUsd, err := chainlink.GetPrice(ethClient, wethPriceFeedAddress)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get the price of WETH from chainlink!"
				k.Payload = err
			})
		}

		stakingEvent, err := fluidity.TryDecodeStakingEventData(l, wethPriceUsd)

		switch err {
		case fluidity.ErrWrongEvent:
			log.Debug(func(k *log.Log) {
				k.Format(
					"Event for log %v of transaction %v was not a staking event!",
					l.Index,
					l.TxHash,
				)
			})
			return

		case nil:
			airdrop.InsertStakingEvent(stakingEvent)

		default:
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to classify a staking event!"
				k.Payload = err
			})
		}
	})
}

// mustEthereumAddressFromEnv to convert an env to an ethereum address,
// or fatal if it's invalid
func mustEthereumAddressFromEnv(env string) ethCommon.Address {
	addressString := util.GetEnvOrFatal(env)

	if !ethCommon.IsHexAddress(addressString) {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to convert %v to an ethereum address!",
				addressString,
			)
		})
	}

	return ethCommon.HexToAddress(addressString)
}
