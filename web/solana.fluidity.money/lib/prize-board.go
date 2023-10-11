// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package api_fluidity_money

import (
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
)

func HandlePrizeBoard(w http.ResponseWriter, r *http.Request) interface{} {
	winnerList := winners.GetLatestWinners(NetworkSolana, 10)
	for i := range winnerList {
		winner := &winnerList[i]
		winner.WinnerAddress = winner.SolanaWinnerOwnerAddress
	}

	return winnerList
}