// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"time"
	_ "time/tzdata"

	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

// getStartOfCurrentDay to return the current time with all values after day
// set to 0, i.e. the beginning of the current day, e.g. 2015-05-17 00:00:00+00
func getStartOfCurrentDay(location *time.Location) time.Time {
	currentTime := time.Now().In(location)
	currentTime = time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), 0, 0, 0, 0, currentTime.Location())

	return currentTime
}

// runs as a cron service, every day at 00:00:05 (adelaide time)
// assumes there are at least 5 active users in a given day
func main() {
	// use UTC to pass timescale a timestamp with no zone, which is then converted within the query
	currentTime := getStartOfCurrentDay(time.UTC)
	// startTime is the day before the current day
	startTime := currentTime.AddDate(0, 0, -1)
	// endTime is the beginning of the day after startTime (the start of the current date)
	endTime := currentTime

	programFound, hasBegun, currentEpoch, currentApplication := lootboxes.GetLootboxConfig()

	// if the lootbox isn't enabled, or it isn't running, then we skip. we
	// treat the cases separately for logging reasons.

	switch false {
	case programFound:
		log.App(func(k *log.Log) {
			k.Message = "No lootbox epoch found! Skipping running."
		})

		return

	case hasBegun:
		log.App(func(k *log.Log) {
			k.Message = "Current lootbox epoch has not yet started! Skipping running."
		})

		return
	}

	var topUsers []lootboxes.UserLootboxCount

	// if there's a current application focus, then we want to reward only specific winners

	switch currentApplication {
	case applications.ApplicationNone:
		topUsers = lootboxes.GetTopUsersByLootboxCount(
			currentEpoch,
			startTime,
			endTime,
		)
	default:
		// fetch and log the top 10 users for a specific application
		topUsers = lootboxes.GetTopApplicationUsersByLootboxCount(
			currentEpoch,
			startTime,
			endTime,
			currentApplication,
		)
	}

	for i, user := range topUsers {
		log.App(func(k *log.Log) {
			k.Format(
				"Top user %d on day %v had address %v and lootbox count %v",
				i,
				startTime.String(),
				user.Address,
				user.LootboxCount,
			)
		})
	}

	// reward the top 10 users
	lootboxes.InsertTopUserReward(currentEpoch, startTime, topUsers)
}
