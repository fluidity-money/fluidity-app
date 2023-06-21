// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lootboxes

import (
	"fmt"
	"html/template"
	"strings"
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

// buildUserRewardValuesString to build a variadic string for the values to insert for top winners
func buildUserRewardValuesString(userCount int) (string, error) {
	if userCount < 1 || userCount > 10 {
		return "", fmt.Errorf(
			"invalid number of leaderboard users - want 1-10, got %d",
			userCount,
		)
	}

	uniqueMessages := []string{
		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none')`,

		`($3, '', 'leaderboard_prize', $1, 0, 1, 20, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 2, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 3, 2, 'none')`,

		`($4, '', 'leaderboard_prize', $1, 0, 1, 15, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 2, 3, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 3, 1, 'none')`,

		`($5, '', 'leaderboard_prize', $1, 0, 1, 12, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 2, 1, 'none')`,

		"($6, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')",

		"($7, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')",

		"($8, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')",

		"($9, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')",

		"($10, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')",

		"($11, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')",
	}

	var output strings.Builder

	for i := 0; i < userCount; i++ {
		tmpl := template.Must(template.New("leaderboardPrize").Parse(uniqueMessages[i]))
		err := tmpl.Execute(&output, i)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to execute template!"
				k.Payload = err
			})
		}

		if i != userCount-1 {
			output.WriteString(",\n")
		}
	}

	return output.String(), nil
}

// InsertTopUserReward to insert lootboxes for the given users for their activity during the airdrop.
// Expects 10 users to reward
func InsertTopUserReward(currentTime time.Time, users []UserLootboxCount) {
	valuesString, err := buildUserRewardValuesString(len(users))

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to build lootbox prize format string!"
			k.Payload = err
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
			%s`,
		TableLootboxes,
		valuesString,
	)

	// build variadic arguments [time, users...]
	var args []interface{}
	args = append(args, currentTime)

	for _, user := range users {
		args = append(args, user.Address)
	}

	_, err = timescaleClient.Exec(
		statementText,
		args...,
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
			awarded_time >= $1 AT TIME ZONE $3 AND
			awarded_time < $2 AT TIME ZONE $4 AND 
			source != 'leaderboard_prize'
		GROUP BY address 
		ORDER BY lootbox_count DESC
		LIMIT $5`,

		TableLootboxes,
	)

	rows, err := timescaleClient.Query(
		statementText,
		startTime,
		endTime,
		LootboxRewardTimezone,
		LootboxRewardTimezone,
		10,
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
			&user.Address,
			&user.LootboxCount,
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

const LootboxRewardTimezone = "Australia/Adelaide"

// fetch the 10 addresses with the highest lootboxes earned during the given period on chronos
func GetTopChronosUsersByLootboxCount(startTime, endTime time.Time) []UserLootboxCount {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT 
			address, 
			SUM(lootbox_count) AS lootbox_count 
		FROM %s
		WHERE 
			awarded_time >= $1 AT TIME ZONE $3 AND
			awarded_time < $2 AT TIME ZONE $4 AND 
			source != 'leaderboard_prize' AND
			application = 'chronos'
		GROUP BY address 
		ORDER BY lootbox_count DESC
		LIMIT $5`,

		TableLootboxes,
	)

	rows, err := timescaleClient.Query(
		statementText,
		startTime,
		endTime,
		LootboxRewardTimezone,
		LootboxRewardTimezone,
		10,
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
			&user.Address,
			&user.LootboxCount,
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

// fetch the 10 addresses with the highest lootboxes earned during the given period on sushiswap
func GetTopSushiswapUsersByLootboxCount(startTime, endTime time.Time) []UserLootboxCount {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT 
			address, 
			SUM(lootbox_count) AS lootbox_count 
		FROM %s
		WHERE 
			awarded_time >= $1 AT TIME ZONE $3 AND
			awarded_time < $2 AT TIME ZONE $4 AND 
			source != 'leaderboard_prize' AND
			application = 'sushiswap'
		GROUP BY address 
		ORDER BY lootbox_count DESC
		LIMIT $5`,

		TableLootboxes,
	)

	rows, err := timescaleClient.Query(
		statementText,
		startTime,
		endTime,
		LootboxRewardTimezone,
		LootboxRewardTimezone,
		10,
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
			&user.Address,
			&user.LootboxCount,
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
