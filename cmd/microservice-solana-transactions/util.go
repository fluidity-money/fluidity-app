package main

import (
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

// intFromEnvOrFatal reads an int that must exist from the environment
func intFromEnvOrFatal(env string) int {
	numString := util.GetEnvOrFatal(env)

	num, err := strconv.Atoi(numString)

	if err != nil {
	    log.Fatal(func(k *log.Log) {
	        k.Format("Failed to read an int from environment variable %s!", env)
	        k.Payload = err
	    })
	}

	return num
}
// parseApplications takes a list of name:address,name:address and returns
// a mapping of address:application
func parseApplications(list string) map[string]applications.Application {
	appsList := strings.Split(list, ",")

	apps := make(map[string]applications.Application)

	for _, appInfo := range appsList {
		appDetails := strings.Split(appInfo, ":")

		if len(appDetails) != 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"App information split not structured properly! %#v",
					appDetails,
				)
			})
		}

		var (
			name    = appDetails[0]
			address = appDetails[1]
		)

		application, err := applications.ParseApplicationName(name)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to decode application name %v",
					name,
				)

				k.Payload = err
			})
		}

		apps[address] = *application
	}

	return apps
}
