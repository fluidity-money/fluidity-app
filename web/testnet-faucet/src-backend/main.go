package main

import "github.com/fluidity-money/microservice-lib/web"

func main() {
	web.JsonEndpoint("/api/request-unique-phrase", HandleUniquePhrase)

	web.JsonEndpoint("/api/submit-question", HandleSubmitQuestion)

	healthCheckHandler := MakeHealthcheckHandler()

	web.Endpoint("/healthcheck", healthCheckHandler)

	web.Endpoint("/api/healthcheck", healthCheckHandler)

	notFoundHandler := MakeNotFoundErrorHandler()

	web.Endpoint("/", notFoundHandler)

	web.Listen()
}
