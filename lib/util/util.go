package util

// util contains functions useful for misc tasks including accessing Envs,
// failing if something goes wrong using the internal logging functions

import (
	"crypto/sha1"
	"os"

	microservice_lib "github.com/fluidity-money/fluidity-app/lib"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

// Context to use when logging
const Context = "UTIL"

// GetWorkerId by using os.Getenv again.
func GetWorkerId() string {
	return GetEnvOrFatal(microservice_lib.EnvWorkerId)
}

// GetEnvOrFatal if the env is not set or set to an empty string
func GetEnvOrFatal(name string) string {
	env := os.Getenv(name)

	if env == "" {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get the env"
			k.Payload = name
		})
	}

	return env
}

func GetEnvOrDefault(name string, defaultValue string) string {
	env := os.Getenv(name)

	if env == "" {
		return defaultValue
	}

	return env
}

func GetHash(data []byte) string {
	hasher := sha1.New()
	hasher.Write(data)
	return string(hasher.Sum(nil))
}
