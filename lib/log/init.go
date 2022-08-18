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

		sentryUrl   = os.Getenv(EnvSentryUrl)

		environment = os.Getenv(microservice_lib.EnvEnvironmentName)
		workerId    = os.Getenv(microservice_lib.EnvWorkerId)
	)

	rand.Seed(time.Now().Unix())

	invocation := os.Args[0]

	go startLoggingServer(
		debugEnabled,
		dieFastEnabled,
		invocation,
		workerId,
		sentryUrl,
		environment,
	)
}
