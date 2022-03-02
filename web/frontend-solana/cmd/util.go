package main

import (
	"net/http"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/web"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

func makeHealthcheckHandler() func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ipAddress := web.GetIpAddress(r)

		if err := r.ParseForm(); err != nil {
			log.App(func(k *log.Log) {
				k.Format(
					"Failed to parse a form from IP %#v!",
					ipAddress,
				)

				k.Payload = err
			})

			return
		}

		log.Debug(func(k *log.Log) {
			k.Message = "Healthcheck hit"
		})

		fmt.Fprintf(w, ":)")
	}
}
