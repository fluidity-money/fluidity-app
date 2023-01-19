package env

import (
	"os"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

const Context = "UTIL/ENV"

func GetEnvOrFatal(name string) string {
	env := os.Getenv(name)

	if env == "" {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Format("Failed to get the env %v!", name)
		})
	}

	return env
}

func OptionalFlag(env string) bool {
	return os.Getenv(env) == "true"
}


