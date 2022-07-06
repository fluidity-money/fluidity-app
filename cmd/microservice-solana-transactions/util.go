package main

import (
	"strings"

	"github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

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
			app     = applications.ParseApplicationName(name)
		)

		apps[address] = app
	}

	return apps
}
