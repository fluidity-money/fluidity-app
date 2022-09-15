// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package log

import (
	"math/rand"
	"os"
	"time"

	"github.com/fluidity-money/fluidity-app/lib"
)

func init() {
	var (
		debugEnabled   = os.Getenv(EnvDebug) == "true"
		dieFastEnabled = os.Getenv(EnvDebugDieFast) == "true"
		silentEnabled  = os.Getenv(EnvSilentMode) == "true"

		sentryUrl   = os.Getenv(EnvSentryUrl)

		environment = os.Getenv(microservice_lib.EnvEnvironmentName)
		workerId    = os.Getenv(microservice_lib.EnvWorkerId)
	)

	rand.Seed(time.Now().Unix())

	invocation := os.Args[0]

	go startLoggingServer(
		debugEnabled,
		dieFastEnabled,
		silentEnabled,
		invocation,
		workerId,
		sentryUrl,
		environment,
	)
}
