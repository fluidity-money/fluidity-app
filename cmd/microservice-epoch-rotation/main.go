// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"
	_ "time/tzdata"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/reward-epoch"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const RANDOM_ORG_URI = `https://api.random.org/json-rpc/4/invoke`
const DEFAULT_UNIX = -62135596800

const (
	// EnvRandomOrgSecret used for Random.org requests
	EnvRandomOrgSecret = `FLU_RANDOM_ORG_SECRET`

	// EnvMeanEpochDays for gaussian distribution generation
	EnvMeanEpochDays = `FLU_REWARD_EPOCH_MEAN_DAYS`

	// EnvEpochApplications for next epoch. Empty to track all applications
	EnvEpochApplications = `FLU_REWARD_EPOCH_APPLICATIONS`
)

// getStartOfCurrentDay to return the current time with all values after day
// set to 0, i.e. the beginning of the current day, e.g. 2015-05-17 00:00:00+00
func getStartOfCurrentDay(location *time.Location) time.Time {
	currentTime := time.Now().In(location)
	currentTime = time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), 0, 0, 0, 0, currentTime.Location())

	return currentTime
}

type RandomOrgReqBodyParams struct {
	ApiKey            string `json:"apiKey"`
	N                 int64  `json:"n"`
	Mean              int64  `json:"mean"`
	StandardDeviation int64  `json:"standardDeviation"`
	SignificantDigits int64  `json:"significantDigits"`
}

type RandomOrgReqBody struct {
	JsonRpc string                 `json:"jsonrpc"`
	Method  string                 `json:"method"`
	Params  RandomOrgReqBodyParams `json:"params"`
	Id      string                 `json:"id"`
}

type RandomOrgRes struct {
	Result struct {
		Random struct {
			Data []float64 `json:"data"`
		} `json:"random"`
	} `json:"result"`
}

func getGaussianValues(apiKey string, n, mean, sd, sigDigits int64) []float64 {
	params := RandomOrgReqBodyParams{
		ApiKey:            apiKey,
		N:                 n,
		Mean:              mean,
		StandardDeviation: sd,
		SignificantDigits: sigDigits,
	}

	bodyRaw := RandomOrgReqBody{
		JsonRpc: "2.0",
		Method:  "generateGaussians",
		Params:  params,
		Id:      "fluidity-gaussian",
	}

	body, err := json.Marshal(bodyRaw)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not marshal body!"
			k.Payload = err
		})
	}

	req, err := http.NewRequest("POST", RANDOM_ORG_URI, bytes.NewBuffer(body))

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not create request!"
			k.Payload = err
		})
	}

	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}

	res, err := client.Do(req)

	if err != nil || res.StatusCode != 200 {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to fetch random values from Random.org!"
			k.Payload = err
		})
	}

	defer res.Body.Close()

	resBody, err := ioutil.ReadAll(res.Body)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to read response from Random.org!"
			k.Payload = err
		})
	}

	var randomOrgRes RandomOrgRes
	if err := json.Unmarshal(resBody, &randomOrgRes); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse response from Random.org!"
			k.Payload = err
		})
	}

	return randomOrgRes.Result.Random.Data
}

func listFromEnv(env string) []string {
	valueString := util.GetEnvOrDefault(env, "")

	valuesList := strings.Split(valueString, ",")

	return valuesList
}

func absDiff(a, b int64) int64 {
	if a < b {
		return b - a
	}

	return a - b
}

// runs as a cron service, every day at 00:00:05 (adelaide time)
func main() {
	var (
		meanEpochDays_    = util.GetEnvOrFatal(EnvMeanEpochDays)
		randomOrgSecret   = util.GetEnvOrFatal(EnvRandomOrgSecret)
		epochApplications = listFromEnv(EnvEpochApplications)
	)

	meanEpochDays, err := strconv.ParseUint(meanEpochDays_, 10, 64)

	// get current epoch
	currRewardEpoch, err := reward_epoch.GetCurrentRewardEpoch()

	var currentEpochEndTime time.Time

	if err != nil || currRewardEpoch.StartTime.Unix() == DEFAULT_UNIX {
		currentEpochEndTime = getStartOfCurrentDay(time.UTC)
	} else {
		currentEpochEndTime = currRewardEpoch.EndTime
	}

	log.Debug(func(k *log.Log) {
		k.Format("currTime: %v", currentEpochEndTime)
	})

	var (
		// numValues is number of values to generate
		numValues = int64(5)

		// meanValue is meanEpochDays in seconds
		meanEpochSeconds = int64(meanEpochDays * 24 * 60 * 60)

		// sd Value is +/-12 Hours in seconds
		sdValue = int64(12 * 60 * 60)

		// significantDigits is 6, to make time values accurate between 1.16 days 11.6 days
		significantDigits = int64(6)
	)

	// get next epoch length
	gaussianRes := getGaussianValues(randomOrgSecret, numValues, meanEpochSeconds, sdValue, significantDigits)

	log.Debug(func(k *log.Log) {
		k.Format("res: %v", gaussianRes)
	})

	idealEndTime := time.Duration(meanEpochDays) * 24 * 60 * 60 * time.Second

	// closestDuration prefers times closest to EnvMeanEpochDays
	var closestDuration time.Duration

	for _, durationSeconds := range gaussianRes {
		if closestDuration == 0 || absDiff(closestDuration, idealEndTime) > absDiff(durationSeconds, idealEndTime) {
			closestDuration = time.Duration(durationSeconds) * time.Second
		}
	}

	startTime := currentEpochEndTime

	endTime := startTime.Add(closestDuration)

	log.Debug(func(k *log.Log) {
		k.Format("%v \n %v", startTime, endTime)
	})

	// write new epoch / epoch applications
	newRewardEpoch := reward_epoch.NewRewardEpoch{
		StartTime:    startTime,
		EndTime:      endTime,
		Applications: epochApplications,
	}

	err = reward_epoch.InsertRewardEpoch(newRewardEpoch)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to insert NewRewardEpoch!"
			k.Payload = err
		})
	}

	newEpoch, err := reward_epoch.GetCurrentRewardEpoch()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to fetch RewardEpoch!"
			k.Payload = err
		})
	}

	if reward_epoch.InsertRewardEpochApplications(newEpoch.EpochId, newRewardEpoch) != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to insert NewRewardEpochApplication!"
			k.Payload = err
		})
	}
}
