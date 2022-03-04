package main

import (
	"fmt"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

func MakeHealthcheckHandler() func(http.ResponseWriter, *http.Request) {
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
		fmt.Fprintf(w, ":)")
	}
}
