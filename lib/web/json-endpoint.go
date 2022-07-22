package web

import (
	"encoding/json"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"net/http"
)

// JsonEndpoint adds some logging code and marshals the return value of
// the handler and sends to the client. If the interface{} is nil, then
// nothing happens.
func JsonEndpoint(endpoint string, handler func(http.ResponseWriter, *http.Request) interface{}) {
	http.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		ipAddress := r.Header.Get(HeaderIpAddress)

		setCorsHeaders(w)

		log.Debugf(
			"Handling a request to the JSON endpoint %v from %v!",
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

		content := handler(w, r)

		if content == nil {
			log.Debugf(
				"Returned content from the handler at %v serving %v is nil!",
				endpoint,
				ipAddress,
			)

			return
		}

		err := json.NewEncoder(w).Encode(content)

		if err != nil {
			log.App(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to marshal a JSON endpoint %v value serving %v",
					endpoint,
					ipAddress,
				)

				k.Payload = err
			})

			return
		}
	})
}
