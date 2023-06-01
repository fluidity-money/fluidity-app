// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
    // LayoutISO to parse the date in the given format
    LayoutISO = "2006-01-02"
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
    // env to override date, otherwise use the current day in adelaide time
    var (
        timeString = util.GetEnvOrDefault(EnvRewardDate, "")

        startTime time.Time
    )

    location, err := time.LoadLocation("Australia/Adelaide")
    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to load a time location!"
            k.Payload = err
        })
    }

    currentTime := getStartOfCurrentDay(location)

    switch timeString {
    // no override set, use the current time
    case "":
        startTime = currentTime
    // an override is set, parse and use it
    default:
        startTime, err = time.ParseInLocation(LayoutISO, timeString, location)
        if err != nil {
            log.Fatal(func(k *log.Log) {
                k.Format(
                    "Failed to parse time %v in layout %v, location %v! %v",
                    timeString,
                    LayoutISO,
                    location.String(),
                    err,
                )
            })
        }
    }

    // endTime is the beginning of the day after startTime
    endTime := startTime
    endTime = endTime.Add(time.Hour * 24)

    // fetch and log the top 10 users
    topUsers := lootboxes.GetTopUsersByLootboxCount(startTime, endTime)
    for i, user := range topUsers {
        log.App(func(k *log.Log) {
            k.Format(
                "Top user %d on day %v had address %v and lootbox count %v",
                i,
                currentTime.String(),
                user.Address,
                user.LootboxCount,
            )
        }) 
    }

    // reward the top 5 users
    lootboxes.InsertTopUserReward(currentTime, topUsers[0:5])
}
