package web

// web is a series of functions that can be useful for building an
// API server. For a more comprehensive user-facing webapp, look at using
// gin in your application. OPTIONS requests are assumed to be preflight
// requests and are handled with sending OK then closing.

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"net/http"
)

const (
	// Context to use when logging
	Context = "WEBSERVER"

	// HeaderIpAddress to use to get the user's IP address
	HeaderIpAddress = `X-Forwarded-For`

	// HeaderCors is used to enable CORS without needing intermediating
	// proxy code
	HeaderCorsAllowOrigin = `Access-Control-Allow-Origin`

	// HeaderCorsAllowHeaders is also used to support permissive CORS
	HeaderCorsAllowHeaders = `Access-Control-Allow-Headers`

	// EnvHttpListenAddress to use to listen on
	EnvHttpListenAddress = `FLU_WEB_LISTEN_ADDR`
)

// StatusValidationFuncFailed is returned when the validation func returns
// a non-nil exit code!
const StatusValidationFuncFailed = 403

// HttpFunction to destink function definitions
type HttpFunction func(http.ResponseWriter, *http.Request)

// AuthenticatedEndpoint listens using http.HandleFunc on a specific
// endpoint, with some overhead for logging and a pass to validate whether
// the connection should continue. Also enables CORS!
func AuthenticatedEndpoint(endpoint, headerName string, validateFunc func(string) error, handler HttpFunction) {
	http.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		var (
			headers     = r.Header

			headerValue = headers.Get(headerName)
			ipAddress   = headers.Get(HeaderIpAddress)
		)

		setCorsHeaders(w)

		debug(
			"Received request from %s to authenticated endpoint %s.",
			ipAddress,
			endpoint,
		)

		if r.Method == http.MethodOptions {
			debug(
				"Request from %v to %v was an OPTIONS preflight(?) request, sending OK",
				ipAddress,
				endpoint,
			)

			w.WriteHeader(http.StatusOK)

			return
		}

		if err := validateFunc(headerValue); err != nil {
			log.App(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Header test for endpoint %s, IP %v with header %v failed!",
					endpoint,
					ipAddress,
					headerName,
				)

				k.Payload = err
			})

			returnStatus(w, StatusValidationFuncFailed)

			return
		}

		handler(w, r)
	})
}

// Endpoint adds some logging code to handle user requests.
// Also enables CORS!
func Endpoint(endpoint string, handler HttpFunction) {
	http.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		ipAddress := r.Header.Get(HeaderIpAddress)

		setCorsHeaders(w)

		debug(
			"Received request from IP %v to %v!",
			ipAddress,
			endpoint,
		)

		if r.Method == http.MethodOptions {
			debug(
				"Request from %v to %v was an OPTIONS preflight(?) request, sending OK",
				ipAddress,
				endpoint,
			)

			w.WriteHeader(http.StatusOK)

			return
		}

		handler(w, r)
	})
}

// Listen gets the listen address from the environment variable and runs
// ListenAndServe
func Listen() {
	listenAddress := util.GetEnvOrFatal(EnvHttpListenAddress)

	// this should never return!

	err := http.ListenAndServe(listenAddress, nil)

	log.Fatal(func(k *log.Log) {
		k.Context = Context
		k.Message = "Web server closed!"
		k.Payload = err
	})
}

// GetIpAddress from a request with HeaderIpAddress
func GetIpAddress(r *http.Request) string {
	return r.Header.Get(HeaderIpAddress)
}
