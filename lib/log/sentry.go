// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package log

import (
	"fmt"

	"github.com/getsentry/sentry-go"
)

func sentryInit(sentryUrl, environment string) error {
	clientOptions := sentry.ClientOptions{
		Dsn:         sentryUrl,
		Environment: environment,
		Debug:       false,
	}

	if err := sentry.Init(clientOptions); err != nil {
		return fmt.Errorf(
			"failed to set up Sentry with dsn %#v and environment %#v! %v",
			sentryUrl,
			environment,
			err,
		)
	}

	return nil
}

func sentryExit() {
	sentry.Flush(SentryExitTime)
}

func sentryLogError(invocation, workerId string, log *log) {
	event := sentry.NewEvent()

	event.Message = log.message
	event.Level = sentry.LevelFatal

	payload := fmt.Sprintf("%#v", log.payload)

	event.Extra = map[string]interface{}{
		"payload": payload,
	}

	event.Tags = map[string]string{
		"worker-id":  workerId,
		"context":    log.context,
		"invocation": invocation,
	}

	_ = sentry.CaptureEvent(event)
}
