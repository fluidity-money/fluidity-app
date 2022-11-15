// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package api_fluidity_money

import (
	"encoding/json"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/solana"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

// maxMintLimit of normalised USD to restrict the amount of USDC/USDT
// that can be cumulatively minted via the webapp
const maxMintLimit = 1_000

type RequestMyMintLimit struct {
	Address string `json:"address"`
}

func HandleMyMintLimit(w http.ResponseWriter, r *http.Request) interface{} {
	var (
		ipAddress = web.GetIpAddress(r)
		request   RequestMyHistory
	)

	err := json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		log.App(func(k *log.Log) {
			k.Format(
				"Failed to decode a user's JSON request from ip %v for /my-mint-limit!",
				ipAddress,
			)

			k.Payload = err
		})

		return returnForbidden(w)
	}

	address := request.Address

	return solana.GetUserAmountMinted(address)
}
