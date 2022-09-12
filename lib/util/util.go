// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package util

// util contains functions useful for misc tasks including accessing Envs,
// failing if something goes wrong using the internal logging functions

import (
	"crypto/sha256"
	"math/rand"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/fluidity-money/fluidity-app/lib"
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
			k.Format("Failed to get the env %v!", name)
		})
	}

	return env
}

// PickEnvOrFatal from a list of inputs provided separated by , -
// picking one at random each time
func PickEnvOrFatal(envName string) (variable string) {
	env := os.Getenv(envName)

	if env == "" {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Format("Failed to pick from env %v!", envName)
		})
	}

	variables := strings.Split(env, ",")

	variablesLen := len(variables)

	if variablesLen == 1 {
		log.Debug(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Picked env number 0 from env %v (only option!)",
				envName,
			)
		})

		return variables[0]
	}

	i := rand.Intn(variablesLen)

	log.Debug(func(k *log.Log) {
		k.Context = Context

		k.Format(
			"Picked env number %v from env %v with length %v",
			i,
			envName,
			variablesLen,
		)
	})

	variable = variables[i]

	if variable == "" {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Chosen input at position %v from env %v was empty!",
				i,
				env,
			)
		})
	}

	return
}

// GetEnvOrDefault returns the env if it is set, otherwise the default value
func GetEnvOrDefault(name string, defaultValue string) string {
	env := os.Getenv(name)

	if env == "" {
		return defaultValue
	}

	return env
}

// GetB16Hash returns the sha1 hash of the byte array encoded to base16
func GetB16Hash(data []byte) string {
	hasher := sha256.New()
	hasher.Write(data)
	sum := hasher.Sum(nil)

	hashHex := hexutil.Encode(sum)

	hashHex = hashHex[2:] // slice off the 0x

	return hashHex
}
