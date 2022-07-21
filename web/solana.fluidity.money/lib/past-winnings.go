// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package api_fluidity_money

import (
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/past-winnings"
)

func HandlePastWinnings(w http.ResponseWriter, r *http.Request) interface{} {
	return past_winnings.GetPastWinnings(NetworkSolana, 30)
}
