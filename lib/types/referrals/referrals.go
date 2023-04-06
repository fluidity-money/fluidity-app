// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package referrals

import "time"

type Referral struct {
	// Referrer is the wallet that initiates the referral
	Referrer string `json:"referrer"`

	// Referee is the wallet that accepted the referral
	Referee string `json:"referee"`

	// CreatedTime refers to the referral should distribute lootboxes
	CreatedTime time.Time `json:"created_time"`

	// Active refers to the referral should distribute lootboxes
	Active bool `json:"active"`

	// Progress is the amount of lootboxes contributed to its activation
	Progress float64 `json:"progress"`
}
