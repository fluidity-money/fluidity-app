// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package log

import "time"

const (
	// EnvDebug is the environment variable that's tested to see if debugging
	// should be turned on.
	EnvDebug = `FLU_DEBUG`

	// EnvDebugDieFast if set to true, die immediately for testing
	EnvDebugDieFast = `FLU_DEBUG_DIE_FAST`

	// EnvSentryUrl to use for logging application logs and errors
	EnvSentryUrl = `FLU_SENTRY_URL`

	// EnvSilentMode to enable when no logging should happen (including Fatal)
	EnvSilentMode = `FLU_SILENT`

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

func Debugf(message string, format ...interface{}) {
	Debug(func(k *Log) {
		k.Format(message, format...)
	})
}

func App(k func(k *Log)) {
	logCooking(loggingLevelApp, k)
}

func Fatal(k func(k *Log)) {
	logCooking(loggingLevelFatal, k)
}
