// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lootboxes

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

type Lootbox struct {
	// Address of lootbox recipient
	Address string `json:"address"`

	// Source of earnt lootbox
	Source lootboxSource `json:"source"`

	// TransactionHash to find the corresponding transaction for the event
	// TransactionHash that is empty indicates no transaction attached
	TransactionHash string `json:"transaction_hash"`

	// AwardedTime of the winning transaction
	AwardedTime time.Time `json:"awarded_time"`

	// Volume that was swapped or sent in native token units
	// Volume of 0 indicates no transaction attached
	Volume misc.BigInt `json:"volume"`

	// RewardTier to indicate the tier of the payout [1-5]
	// RewardTier of 0 indicates no payout event attached
	RewardTier int `json:"reward_tier"`

	// LootboxCount is the amount of earned lootboxes from event
	LootboxCount float64 `json:"lootbox_count"`

	// Application is the application involved in the source transfer
	Application applications.Application `json:"application"`
}
