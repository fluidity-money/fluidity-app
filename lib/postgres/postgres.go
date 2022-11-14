// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package postgres

// postgres simply connects to the Postgres database via
// database/sql and exposes it using client.  The first use of the client
// should call Ready!

import (
	"database/sql"
	"runtime"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

const (
	// EnvDatabaseUri to use to connect to the Postgres/Timeseries database
	EnvDatabaseUri = `FLU_POSTGRES_URI`

	// Context is the context for logging purposes (only used during init)
	Context = "POSTGRES"
)

var (
	// Client is the connected database using database/sql and github.com/lib/pq
	client *sql.DB

	// ready should be checked for the first time to indicate that the
	readyChan = make(chan bool)
)

// Client should be used to get a handle on the database client
func Client() *sql.DB {
	pc, file, linenum, ok := runtime.Caller(1)
	if (!ok) {
		log.Debug(func (k *log.Log) {
			k.Context = Context
			k.Message = "Postgres client being acquired by an unknown caller..."
		})
	} else {
		details := runtime.FuncForPC(pc)

		log.Debug(func (k *log.Log) {
			k.Context = Context
			k.Format(
				"Postgres client being acquired by %s, %s:%d",
				details.Name(),
				file,
				linenum,
			)
		})
	}

	<-readyChan
	return client
}
