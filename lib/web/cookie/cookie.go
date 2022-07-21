package cookie

// cookie implements code that uses Redis and Postgres in tandem to utilise
// authenticated sessions. May only fatal if a cookie generation fails
// or a serialisation of a successful login cookie fails.

import (
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"net/http"
	"time"
)

const (
	// CacheTimeNormalUser of 5 days before expiring the cookie
	CacheTimeNormalUser = 24 * time.Hour * 3

	// CookieGeneratedSize to create to give the user as a cookie
	CookieGeneratedSize = 8 * 2

	// Context to use when logging
	Context = `WEB/COOKIE`

	// HeaderAccessDenied sent when cookie access fails
	HeaderAccessDenied = http.StatusUnauthorized
)

type (
	// HttpFunctionState to use when taking requests which can overtly fail.
	// Also includes state that the backend has associated with the user.
	HttpFunctionState func([]byte, http.ResponseWriter, *http.Request) (interface{}, error)

	// EndpointLoginReturn is returned by EndpointLogin to users who
	// successfully authenticate to EndpointLogin. Contains the name
	// of the cookie and its expiration date.
	EndpointLoginReturn struct {
		CookieName string `json:"cookie_name"`
		Expiration uint64 `json:"expiration"`
	}
)

// Endpoint formats a cookie name as <cookieBaseName>-<headerValue>, looks
// it up, if it's not empty then calls the handler with it as an argument.
// The handler can return a non-nil interface{}, and in doing so, can update
// the state of the cookie if it's still set. If it returns an error, a
// logging message is reported and the user's state is left as-is.
func Endpoint(endpoint, headerName, cookieBaseName string, handler HttpFunctionState) {
	http.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		var (
			headers     = r.Header
			ipAddress   = headers.Get(web.HeaderIpAddress)
			headerValue = headers.Get(headerName)
		)

		setCorsHeaders(w)

		if r.Method == http.MethodOptions {
			log.Debugf(
				"Request from %v to %v was an OPTIONS preflight(?) request, sending OK",
				ipAddress,
				endpoint,
			)

			w.WriteHeader(http.StatusOK)

			return
		}

		if headerValue == "" {
			log.App(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Header value of %#v accessing %v by %v is empty!",
					headerName,
					endpoint,
					ipAddress,
				)
			})

			return
		}

		cookieName := fmt.Sprintf(
			"%s-%s",
			cookieBaseName,
			headerValue,
		)

		cookieValue := state.Get(cookieName)

		if len(cookieValue) == 0 {
			log.App(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Cookie %v for endpoint accessed by %v is empty!",
					cookieName,
					ipAddress,
				)
			})

			returnAccessDenied(w)

			return
		}

		newCookieValue, err := handler(cookieValue, w, r)

		if err != nil {
			log.App(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Handler for endpoint %v for IP %v cookie %v failed! %v",
					endpoint,
					ipAddress,
					cookieName,
					err,
				)
			})

			returnAccessDenied(w)

			return
		}

		if newCookieValue == nil {
			return
		}

		log.Debugf(
			"Cookie name %v, IP %v is being updated with a new value of %v!",
			cookieName,
			ipAddress,
			newCookieValue,
		)

		updated := state.SetTimedIfSet(cookieName, newCookieValue)

		if !updated {
			log.Debugf(
				"Cookie name %v, IP %v was not updated in the end, key expired.",
				cookieName,
				ipAddress,
			)
		}
	})
}

// Login the user, storing the state of a return value provided by
// handler in Redis with a timeout period attached to the cookie.
// If an error happens with the handler, the request is closed without
// setting a header. Serialises a EndpointLoginReturn containing the new
// header and random value for the header value.
func Login(endpoint, cookieName string, cacheTime uint64, handler HttpFunctionState) {
	http.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		ipAddress := r.Header.Get(web.HeaderIpAddress)

		setCorsHeaders(w)

		log.Debugf(
			"Handling an endpoint login at %v with IP address %v!",
			endpoint,
			ipAddress,
		)

		if r.Method == http.MethodOptions {
			log.Debugf(
				"Request from %v to %v was an OPTIONS preflight(?) request, sending OK",
				ipAddress,
				endpoint,
			)

			w.WriteHeader(http.StatusOK)

			return
		}

		newState, err := handler(nil, w, r)

		if err != nil {
			log.App(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Endpoint login at %v with IP %v failed!",
					endpoint,
					ipAddress,
				)

				k.Payload = err
			})

			return
		}

		log.Debugf(
			"Handler serving endpoint %v with IP %v returned!",
			endpoint,
			ipAddress,
		)

		if newState == nil {
			log.Debugf(
				"Handled a login at endpoint %v from IP %v, but the new state is empty!",
				endpoint,
				ipAddress,
			)

			return
		}

		newCookie := generateCookie()

		newCookieName := fmt.Sprintf(
			"%s-%s",
			cookieName,
			newCookie,
		)

		log.Debugf(
			"Generated a new cookie for %v serving IP %v, %v. Value %v!",
			endpoint,
			ipAddress,
			newCookieName,
			newState,
		)

		state.SetTimed(newCookieName, cacheTime, newState)

		log.Debugf(
			"Set a new timed state for endpoint %v IP %v cookie %v!",
			endpoint,
			ipAddress,
			newCookieName,
		)

		// send the user reusable authenticated state

		err = sendEndpointLogin(w, newCookie, cacheTime)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to serialise a successful login from IP %v with cookie name %v!",
					ipAddress,
					newCookieName,
				)

				k.Payload = err
			})
		}
	})
}
