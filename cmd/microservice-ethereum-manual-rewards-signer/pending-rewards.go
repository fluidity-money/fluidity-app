// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"encoding/json"
	"net/http"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

type RequestPendingRewards struct {
	Address string `json:"address"`
}

func GetPendingRewardsHandler(net network.BlockchainNetwork) func(http.ResponseWriter, *http.Request) interface{} {
	return func (w http.ResponseWriter, r *http.Request) interface{} {
		var (
			ipAddress = web.GetIpAddress(r)
			request   RequestPendingRewards
		)

		err := json.NewDecoder(r.Body).Decode(&request)

		if err != nil {
			log.App(func(k *log.Log) {
				k.Format(
					"Failed to decode a user's JSON request from ip %v for /pending-rewards!",
					ipAddress,
				)

				k.Payload = err
			})

			w.WriteHeader(http.StatusForbidden)
			return nil
		}

		var (
			addressString = request.Address
			address       = ethTypes.AddressFromString(addressString)
		)

		timescaleClient := timescale.Client()
		pendingWinnersHandler := spooler.NewPendingWinnersHandler(timescaleClient)

		rewards := pendingWinnersHandler.GetPendingRewardsForAddress(net, addressString)

		spooledRewards, err := ethereum.BatchWinningsByToken(rewards, address)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to batch rewards!"
				k.Payload = err
			})
		}

		return spooledRewards
	}
}
