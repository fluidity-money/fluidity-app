package log

import (
	"fmt"
	"io"
	"os"
	"time"
)

// LoggingServerContext is the context that we use in the error messages
// to identify logging related errors.
const LoggingServerContext = `logging`

const (
	LoggingLevelDebug = "debug"
	LoggingLevelApp   = "app"
	LoggingLevelFatal = "fatal"
)

const (
	loggingLevelDebug = iota
	loggingLevelApp
	loggingLevelFatal
)

type log struct {
	level            int
	context, message string
	payload          interface{}
	reply            chan error
}

var (
	loggingServer               = make(chan *log)
	loggingAreWeDebuggingServer = make(chan bool)

	loggingStream = os.Stderr
)

func processExit() {
	sentryExit()
	os.Exit(1)
}

func printLoggingMessage(stream io.WriteCloser, time time.Time, workerId, level, context, message string, payload interface{}) {
	var payload_ string

	if context == "" {
		context = "default"
	}

	if payload != nil {
		payload_ = fmt.Sprintf("%v", payload)
	}

	fmt.Fprintf(
		stream,
		"[%v] [%s:%s] %s %v\n",
		time,
		level,
		context,
		message,
		payload_,
	)
}

func startLoggingServer(debugEnabled bool, processInvocation, workerId, sentryUrl, environment string) {

	if err := sentryInit(sentryUrl, environment); err != nil {
		fmt.Fprintf(
			os.Stderr,
			"Failed to initialise Sentry! %v\n",
			err,
		)

		processExit()
	}

	for {
		select {
		case loggingAreWeDebuggingServer <- debugEnabled:

		case log := <-loggingServer:
			var (
				context = log.context
				message = log.message
				payload = log.payload
				reply   = log.reply
				level   = log.level

				logString string

				isSentryError bool
				shouldExit    bool
			)

			switch level {
			case loggingLevelDebug:
				logString = LoggingLevelDebug

			case loggingLevelApp:
				logString = LoggingLevelApp

			case loggingLevelFatal:
				logString = LoggingLevelFatal

				isSentryError = true
				shouldExit = true
			}

			now := time.Now()

			printLoggingMessage(
				loggingStream,
				now,
				workerId,
				logString,
				context,
				message,
				payload,
			)

			if isSentryError {
				sentryLogError(processInvocation, workerId, log)
			}

			if shouldExit {
				processExit()
			}

			reply <- nil
		}
	}
}

func (k *Log) Format(message string, format ...interface{}) {
	k.Message = fmt.Sprintf(message, format...)
}

func logMessage(level int, context, message string, payload interface{}) {
	reply := make(chan error)
	log := log{level, context, message, payload, reply}
	loggingServer <- &log
	_ = <-reply
}

func logCooking(level int, k func(k *Log)) {
	log := new(Log)
	k(log)
	logMessage(level, log.Context, log.Message, log.Payload)
}
