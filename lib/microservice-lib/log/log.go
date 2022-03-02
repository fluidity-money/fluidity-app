package log

import "time"

const (
	// EnvDebug is the environment variable that's tested to see if debugging
	// should be turned on.
	EnvDebug = `FLU_DEBUG`

	// EnvSentryUrl to use for logging application logs and errors
	EnvSentryUrl = `FLU_SENTRY_URL`

	// sentryExitTime to take when exiting while logging
	SentryExitTime = 2 * time.Second
)

type Log struct {
	Context string      `json:"context"`
	Message string      `json:"message"`
	Payload interface{} `json:"payload"`
}

func DebugEnabled() bool {
	return <-loggingAreWeDebuggingServer
}

func Debug(k func(k *Log)) {
	if !DebugEnabled() {
		return
	}

	logCooking(loggingLevelDebug, k)
}

func App(k func(k *Log)) {
	logCooking(loggingLevelApp, k)
}

func Fatal(k func(k *Log)) {
	logCooking(loggingLevelFatal, k)
}
