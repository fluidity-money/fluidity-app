// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lootboxes

import (
	"fmt"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
)

const ExpectedTopUsers = 10

// UserLootboxCount to group an address and their respective lootboxes
type UserLootboxCount struct {
	Address      string  `json:"address"`
	LootboxCount float64 `json:"lootbox_count"`
}

// InsertTopUserReward to insert lootboxes for the given users for their activity during the airdrop.
// Expects 10 users to reward
func InsertTopUserReward(currentTime time.Time, users []UserLootboxCount) {
	if lenUsers := len(users); lenUsers != ExpectedTopUsers {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Expected top %d leaderboard winners, but got %d values!",
				ExpectedTopUsers,
				lenUsers,
			)
		})
	}

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			address, 
			transaction_hash, 
			source, 
			awarded_time, 
			volume, 
			reward_tier, 
			lootbox_count, 
			application
		) VALUES
		('$1', '', 'leaderboard_prize', '$6', 0, 1, 30, 'none'),
		('$1', '', 'leaderboard_prize', '$6', 0, 2, 10, 'none'),
		('$1', '', 'leaderboard_prize', '$6', 0, 3, 5, 'none'),

		('$2', '', 'leaderboard_prize', '$6', 0, 1, 20, 'none'),
		('$2', '', 'leaderboard_prize', '$6', 0, 2, 5, 'none'),
		('$2', '', 'leaderboard_prize', '$6', 0, 3, 2, 'none'),

		('$3', '', 'leaderboard_prize', '$6', 0, 1, 15, 'none'),
		('$3', '', 'leaderboard_prize', '$6', 0, 2, 3, 'none'),
		('$3', '', 'leaderboard_prize', '$6', 0, 3, 1, 'none'),

		('$4', '', 'leaderboard_prize', '$6', 0, 1, 12, 'none'),
		('$4', '', 'leaderboard_prize', '$6', 0, 2, 1, 'none'),

		('$5', '', 'leaderboard_prize', '$6', 0, 1, 10, 'none'),

		('$6', '', 'leaderboard_prize', '$6', 0, 1, 10, 'none'),

		('$7', '', 'leaderboard_prize', '$6', 0, 1, 10, 'none'),

		('$8', '', 'leaderboard_prize', '$6', 0, 1, 10, 'none'),

		('$9', '', 'leaderboard_prize', '$6', 0, 1, 10, 'none'),

		('$10', '', 'leaderboard_prize', '$6', 0, 1, 10, 'none')`,
		TableLootboxes,
	)

	_, err := timescaleClient.Exec(
		statementText,
		users[0].Address,
		users[1].Address,
		users[2].Address,
		users[3].Address,
		users[4].Address,
		users[5].Address,
		users[6].Address,
		users[7].Address,
		users[8].Address,
		users[9].Address,
		currentTime,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert top user rewards!"
			k.Payload = err
		})
	}
}

// fetch the 10 addresses with the highest lootboxes earned during the given period
func GetTopUsersByLootboxCount(startTime, endTime time.Time) []UserLootboxCount {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT 
			address, 
			SUM(lootbox_count) AS lootbox_count 
		FROM %s
		WHERE 
			awarded_time >= $1 AT TIME ZONE 'Australia/Adelaide' AND
			awarded_time < $2 AT TIME ZONE 'Australia/Adelaide' AND 
			source != 'leaderboard_prize' 
		GROUP BY address 
		ORDER BY lootbox_count DESC
		LIMIT 10`,

		TableLootboxes,
	)

	rows, err := timescaleClient.Query(
		statementText,
		startTime,
		endTime,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get the top 10 users by lootbox count!"
			k.Payload = err
		})
	}

	defer rows.Close()

	var topUsers []UserLootboxCount

	for rows.Next() {
		var user UserLootboxCount
		err := rows.Scan(
			user.Address,
			user.LootboxCount,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a user's address and lootbox count!"
				k.Payload = err
			})
		}

		topUsers = append(topUsers, user)
	}

	return topUsers
}

// fetch the 10 addresses with the highest lootboxes earned during the given period on chronos
func GetTopChronosUsersByLootboxCount(startTime, endTime time.Time) []UserLootboxCount {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT 
			address, 
			SUM(lootbox_count) AS lootbox_count 
		FROM %s
		WHERE 
			awarded_time >= $1 AT TIME ZONE 'Australia/Adelaide' AND
			awarded_time < $2 AT TIME ZONE 'Australia/Adelaide' AND 
			source != 'leaderboard_prize' AND
			application = 'chronos'
		GROUP BY address 
		ORDER BY lootbox_count DESC
		LIMIT 10`,

		TableLootboxes,
	)

	rows, err := timescaleClient.Query(
		statementText,
		startTime,
		endTime,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get the top 10 users by lootbox count!"
			k.Payload = err
		})
	}

	defer rows.Close()

	var topUsers []UserLootboxCount

	for rows.Next() {
		var user UserLootboxCount
		err := rows.Scan(
			user.Address,
			user.LootboxCount,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a user's address and lootbox count!"
				k.Payload = err
			})
		}

		topUsers = append(topUsers, user)
	}

	return topUsers
}
