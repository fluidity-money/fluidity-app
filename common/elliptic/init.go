// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package elliptic

import (
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvEllipticKey to use as the api key for any requests to Elliptic
	EnvEllipticKey = "FLU_ELLIPTIC_KEY"

	// EnvEllipticSecret to use for secret key authentication to Elliptic
	EnvEllipticSecret = "FLU_ELLIPTIC_SECRET"
)

type config struct {
	apiKey string
	secret string
}

var keyRequests = make(chan config)

func init() {
	var (
		key    = util.GetEnvOrFatal(EnvEllipticKey)
		secret = util.GetEnvOrFatal(EnvEllipticSecret)
	)

	go func() {
		for {
			keyRequests <- config{
				apiKey: key,
				secret: secret,
			}
		}
	}()
}
