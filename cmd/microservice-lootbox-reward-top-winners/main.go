// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"time"
	_ "time/tzdata"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

const (
	// LayoutISO to parse the date in the given format
	LayoutISO = `2006-01-02`
	// Location for the timezone location to use for partitioning users
	Location = `Australia/Adelaide`
	// EnvRewardDate to override the date to reward top winners for, otherwise using the current date
	// In the format yyyy-mm-dd, parsed in Australia/Adelaide (ACST)
	EnvRewardDate = `FLU_REWARD_DATE`
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
	location, err := time.LoadLocation(Location)
	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to load a time location!"
			k.Payload = err
		})
	}

	currentTime := getStartOfCurrentDay(location)
	// startTime is the day before the current day
	startTime := currentTime.AddDate(0, 0, -1)
	// endTime is the beginning of the day after startTime (the start of the current date)
	endTime := currentTime

	// fetch and log the top 10 users
	topUsers := lootboxes.GetTopUsersByLootboxCount(startTime, endTime)
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
	lootboxes.InsertTopUserReward(startTime, topUsers)
}
