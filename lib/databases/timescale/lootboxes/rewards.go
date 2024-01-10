// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lootboxes

import (
	"fmt"
	"strings"
	"text/template"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
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

	rewardStrings := []string{
		`($3, '', 'leaderboard_prize', $1, 0, 1, 30, 'none', $2),
($3, '', 'leaderboard_prize', $1, 0, 2, 10, 'none', $2),
($3, '', 'leaderboard_prize', $1, 0, 3, 5, 'none', $2)`,

		`($4, '', 'leaderboard_prize', $1, 0, 1, 20, 'none', $2),
($4, '', 'leaderboard_prize', $1, 0, 2, 5, 'none', $2),
($4, '', 'leaderboard_prize', $1, 0, 3, 2, 'none', $2)`,

		`($5, '', 'leaderboard_prize', $1, 0, 1, 15, 'none', $2),
($5, '', 'leaderboard_prize', $1, 0, 2, 3, 'none', $2),
($5, '', 'leaderboard_prize', $1, 0, 3, 1, 'none', $2)`,

		`($6, '', 'leaderboard_prize', $1, 0, 1, 12, 'none', $2),
($6, '', 'leaderboard_prize', $1, 0, 2, 1, 'none', $2)`,

		"($7, '', 'leaderboard_prize', $1, 0, 1, 10, 'none', $2)",

		"($8, '', 'leaderboard_prize', $1, 0, 1, 10, 'none', $2)",

		"($9, '', 'leaderboard_prize', $1, 0, 1, 10, 'none', $2)",

		"($10, '', 'leaderboard_prize', $1, 0, 1, 10, 'none', $2)",

		"($11, '', 'leaderboard_prize', $1, 0, 1, 10, 'none', $2)",

		"($12, '', 'leaderboard_prize', $1, 0, 1, 10, 'none', $2)",
	}

	var output strings.Builder

	// custom sub function to find the last index of the array
	funcMap := template.FuncMap{
		"sub": func(a, b int) int {
			return a - b
		},
	}

	// print each line of rewardStrings, separated by a comma and newline, except for the last
	tmpl := template.Must(template.New("leaderboardPrize").Funcs(funcMap).Parse(`
		{{- $lineCount := len .RewardStrings }}
		{{- $lastIndex := sub $lineCount 1 }}
		{{- range $i, $reward := .RewardStrings }}
		{{- $reward }}
		{{- if ne $i $lastIndex }},{{ println }}{{ end }}
		{{- end }}`,
	))

	data := struct {
		RewardStrings []string
	}{
		RewardStrings: rewardStrings[:userCount],
	}

	err := tmpl.Execute(&output, data)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to execute template!"
			k.Payload = err
		})
	}

	return output.String(), nil
}

// InsertTopUserReward to insert lootboxes for the given users for their activity during the airdrop.
// Expects 10 users to reward
func InsertTopUserReward(currentEpoch string, currentTime time.Time, users []UserLootboxCount) {
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
			application,
			epoch
		) VALUES
			%s`,
		TableLootboxes,
		valuesString,
	)

	// build variadic arguments [time, users...]
	args := []interface{}{currentTime, currentEpoch}

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
func GetTopUsersByLootboxCount(currentEpoch string, startTime, endTime time.Time) []UserLootboxCount {
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
			epoch = $5
		GROUP BY address
		ORDER BY lootbox_count DESC
		LIMIT $6`,

		TableLootboxes,
	)

	rows, err := timescaleClient.Query(
		statementText,
		startTime,
		endTime,
		LootboxRewardTimezone,
		LootboxRewardTimezone,
		currentEpoch,
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

		err := rows.Scan(&user.Address, &user.LootboxCount)

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

// fetch the 10 addresses with the highest lootboxes earned during the given period on the given application
func GetTopApplicationUsersByLootboxCount(currentEpoch string, startTime, endTime time.Time, application applications.Application) []UserLootboxCount {
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
			application = $6 AND
			epoch = $7
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
		application.String(),
		currentEpoch,
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

		err := rows.Scan(&user.Address, &user.LootboxCount)

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

// UpdateOrInsertAmountsRewarded for the current user in the specific
// epoch that's taking place.
func UpdateOrInsertAmountsRewarded(network_ network.BlockchainNetwork, lootboxCurrentEpoch, tokenShortName string, amountNormalLossy float64, winnerAddress, application string) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			network,
			epoch,
			token_short_name,
			amount_earned,
			winner,
			application,
			last_updated
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			CURRENT_TIMESTAMP
		)
		ON CONFLICT (network, epoch, token_short_name, winner, application)
		DO UPDATE SET
			amount_earned = lootbox_amounts_rewarded.amount_earned + $4,
			last_updated = CURRENT_TIMESTAMP`,

		TableLootboxAmountsRewarded,
	)

	_, err := timescaleClient.Exec(
		statementText,
		network_,
		lootboxCurrentEpoch,
		tokenShortName,
		amountNormalLossy,
		application,
		winnerAddress,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to upsert a lootbox amount rewarded!"
			k.Payload = err
		})
	}
}
