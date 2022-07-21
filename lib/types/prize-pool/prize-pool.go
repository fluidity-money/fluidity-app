// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package prize_pool

import "time"

type PrizePool struct {
	Network     string    `json:"network"`
	Amount      float64   `json:"amount"`
	LastUpdated time.Time `json:"last_updated"`
}
