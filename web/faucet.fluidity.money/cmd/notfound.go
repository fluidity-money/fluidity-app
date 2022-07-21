// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/log"
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
