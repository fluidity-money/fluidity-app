// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package api_fluidity_money

import (
	"encoding/json"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

// maxRequest to use when getting user's user action history
const maxRequest = 20

type RequestMyHistory struct {
	Address string `json:"address"`
	Count   int    `json:"count"`
}

func HandleMyHistory(w http.ResponseWriter, r *http.Request) interface{} {
	var (
		ipAddress = web.GetIpAddress(r)
		request   RequestMyHistory
	)

	err := json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		log.App(func(k *log.Log) {
			k.Format(
				"Failed to decode a user's JSON request from ip %v for /my-history!",
				ipAddress,
			)

			k.Payload = err
		})

		return returnForbidden(w)
	}

	var (
		address = request.Address
		count   = request.Count
	)

	// if the count for the user's larger than the max request limit or negative,
	// we use the default

	if count > maxRequest || count < 0 {
		count = maxRequest
	}

	return user_actions.GetUserActionsWithSenderAddressOrRecipientAddress(
		NetworkEthereum,
		address,
		count,
	)
}
