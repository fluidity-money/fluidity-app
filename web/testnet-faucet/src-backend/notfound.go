package main

import (
	"fmt"
	"net/http"

	"github.com/fluidity-money/microservice-lib/log"
)

func MakeNotFoundErrorHandler() func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		log.App(func(k *log.Log) {
			k.Format(
				"404: Host %#v  Url: %#v  RequestUri: %#v  ",
				r.Host,
				r.URL,
				r.RequestURI,
			)
		})
		fmt.Fprint(w, "404")
	}
}
