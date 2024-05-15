// Copyright 2024 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package applications

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

// Application supported by the Sui worker
type Application int64

const (
	// ApplicationNone is the default application, representing a transfer
	ApplicationNone Application = iota
)

// applicationNames is used to map human readable names to their enum varients
var applicationNames = []string{
	"none",
}

func (app Application) String() string {
	return applicationNames[app]
}

// ParseApplication based on the name given
func ParseApplicationName(name string) (*Application, error) {
	for i, app := range applicationNames {
		if app == name {
			application_ := Application(i)
			return &application_, nil
		}
	}

	return nil, fmt.Errorf(
		"unknown app name %s",
		name,
	)
}

type UtilityDetails struct {
	Utility      applications.UtilityName
	TokenDetails token_details.TokenDetails
}

// UtilityListFromEnvOrFatal parses a list of `utility:token_short_name:token_decimals:address:address,utility:token_short_name:token_decimals:address:address` into a map of {utility => app, token details}
func UtilityListFromEnvOrFatal(key string) map[string]UtilityDetails {
	utilitiesList := util.GetEnvOrFatal(key)

	utilities := make(map[string]UtilityDetails)

	for _, appAddresses_ := range strings.Split(utilitiesList, ",") {
		appAddresses := strings.Split(appAddresses_, ":")

		if len(appAddresses) < 4 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Malformed utilities address line '%s'!",
					appAddresses_,
				)
			})
		}

		utility := applications.UtilityName(appAddresses[0])

		var (
			tokenShortName      = appAddresses[1]
			tokenDecimalsString = appAddresses[2]
		)

		tokenDecimals, err := strconv.Atoi(tokenDecimalsString)
		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to parse token decimals '%s'!",
					tokenDecimalsString,
				)
				k.Payload = err
			})
		}

		tokenDetails := token_details.New(tokenShortName, tokenDecimals)

		for _, address := range appAddresses[3:] {
			utilities[address] = UtilityDetails{
				Utility:      utility,
				TokenDetails: tokenDetails,
			}
		}
	}

	return utilities
}

// UtilityListFromEnv parses a list of `utility:token_short_name:token_decimals:address:address,utility:token_short_name:token_decimals:address:address` into a map of {utility => app, token details}
// or return an empty map if no utilities are set
func UtilityListFromEnv(key string) map[string]UtilityDetails {
	utilitiesList := util.GetEnvOrDefault(key, "")

	utilities := make(map[string]UtilityDetails)

	// exit early if there are no utilities
	if utilitiesList == "" {
		return utilities
	}

	for _, appAddresses_ := range strings.Split(utilitiesList, ",") {
		appAddresses := strings.Split(appAddresses_, ":")

		if len(appAddresses) < 4 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Malformed utilities address line '%s'!",
					appAddresses_,
				)
			})
		}

		utility := applications.UtilityName(appAddresses[0])

		var (
			tokenShortName      = appAddresses[1]
			tokenDecimalsString = appAddresses[2]
		)

		tokenDecimals, err := strconv.Atoi(tokenDecimalsString)
		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to parse token decimals '%s'!",
					tokenDecimalsString,
				)
				k.Payload = err
			})
		}

		tokenDetails := token_details.New(tokenShortName, tokenDecimals)

		for _, address := range appAddresses[3:] {
			utilities[address] = UtilityDetails{
				Utility:      utility,
				TokenDetails: tokenDetails,
			}
		}
	}

	return utilities
}
