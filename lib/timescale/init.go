// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package timescale

import (
	"database/sql"
	"regexp"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
	_ "github.com/lib/pq"
)

func init() {
	databaseUri := util.GetEnvOrFatal(EnvDatabaseUri)

	log.Debug(func(k *log.Log) {
		k.Context = Context
		k.Message = "Connecting to the Postgres database..."
	})

	var err error

	client, err = sql.Open("postgres", databaseUri)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to open a connection to the Postgres database!"
			k.Payload = err
		})
	}

	if _, err := client.Exec("SELECT 1"); err != nil {
		// hide sensitive uri components in log output
		userPassRegex := regexp.MustCompile(`:\/\/(.*?):(.*?)@`)
		errHidden := userPassRegex.ReplaceAllString(err.Error(),`://HIDDEN_USER_PASS@`)

		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to connect to the Timescale database!"
			k.Payload = errHidden
		})
	}

	log.Debug(func(k *log.Log) {
		k.Context = Context
		k.Message = "Connected to the Postgres database!"
	})

	go func() {
		for {
			readyChan <- true
		}
	}()
}
