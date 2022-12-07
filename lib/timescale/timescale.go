// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package timescale

// timescale simply connects to the Timescale database via
// database/sql and exposes it using client.  The first use of the client
// should call Ready!

import (
	"database/sql"
	"regexp"
	"runtime"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
	_ "github.com/lib/pq"
)

const (
	// EnvDatabaseUri to use to connect to the Postgres/Timeseries database
	EnvDatabaseUri = `FLU_TIMESCALE_URI`

	// Context is the context for logging purposes (only used during init)
	Context = "TIMESCALE"
)

var (
	// Client is the connected database using database/sql and github.com/lib/pq
	client *sql.DB
)

// Client should be used to get a handle on the database client
func Client() *sql.DB {
	if client == nil {
		return openNewClient()
	} else {
		return getExistingClient()
	}
}

// getExistingClient to reuse the globally shared client
func getExistingClient() *sql.DB {
	// handler could have too many clients, so check before returning it
	pingDatabaseOrFatal()

	logStats()

	pc, file, linenum, ok := runtime.Caller(1)
	if !ok {
		log.Debug(func(k *log.Log) {
			k.Context = Context
			k.Message = "Timescale client being acquired by an unknown caller..."
		})
	} else {
		details := runtime.FuncForPC(pc)

		log.Debug(func(k *log.Log) {
			k.Context = Context
			k.Format(
				"Timescale client being acquired by %s, %s:%d",
				details.Name(),
				file,
				linenum,
			)
		})
	}

	return client
}

// openNewClient to open a connection the first time Timescale is used by the application
func openNewClient() *sql.DB {
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

	pingDatabaseOrFatal()

	log.Debug(func(k *log.Log) {
		k.Context = Context
		k.Message = "Connected to the Postgres database!"
	})

	logStats()

	return client
}

// pingDatabaseOrFatal to ensure `client`'s connection is still valid
func pingDatabaseOrFatal() {
	if _, err := client.Exec("SELECT 1"); err != nil {

		// hide sensitive uri components in log output
		userPassRegex := regexp.MustCompile(`:\/\/(.*?):(.*?)@`)
		errHidden := userPassRegex.ReplaceAllString(err.Error(), `://HIDDEN_USER_PASS@`)

		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to connect to the Timescale database!"
			k.Payload = errHidden
		})
	}
}

// logStats to print Timescale connection pool status
func logStats() {
	log.Debug(func(k *log.Log) {
		k.Context = Context

		stats := client.Stats()

		k.Format(
			"Timescale connection pool stats: max %d, open %d, inuse %d, idle %d",
			stats.MaxOpenConnections,
			stats.OpenConnections,
			stats.InUse,
			stats.Idle,
		)
	})
}
