package timescale

import (
	"database/sql"
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
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to connect to the Timescale database!"
			k.Payload = err
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
