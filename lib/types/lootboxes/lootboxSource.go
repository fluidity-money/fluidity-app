// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lootboxes

type lootboxSource string

const (
	Airdrop     lootboxSource = "airdrop"
	Transaction lootboxSource = "transaction"
	Referral    lootboxSource = "referral"
	// Leaderboard for rewards that don't contribute towards top winnings
	Leaderboard lootboxSource = "leaderboard_prize"
)
