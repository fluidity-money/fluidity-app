// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package api_fluidity_money

import (
	"github.com/fluidity-money/fluidity-app/lib/types/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/types/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
)

// Update is relayed over websocket when an update event happens
type Update struct {
	Winner     *winners.Winner          `json:"winner"`
	UserAction *user_actions.UserAction `json:"user_action"`
	PrizePool  *prize_pool.PrizePool    `json:"prize_pool"`
}
