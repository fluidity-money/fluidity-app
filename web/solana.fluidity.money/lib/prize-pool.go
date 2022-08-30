// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package api_fluidity_money

import (
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/prize-pool"
)

func HandlePrizePool(w http.ResponseWriter, r *http.Request) interface{} {

	prizePool := prize_pool.GetPrizePool(NetworkSolana)

	if prizePool == nil {
		prizePool = new(prize_pool.PrizePool)
	}

	return prizePool
}
