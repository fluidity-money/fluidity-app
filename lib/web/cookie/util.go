// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package cookie

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"io"
	"net/http"
)

func returnAccessDenied(w http.ResponseWriter) {
	w.WriteHeader(HeaderAccessDenied)
}

func setCorsHeaders(w http.ResponseWriter) {
	headers := w.Header()

	headers.Set(web.HeaderCorsAllowOrigin, "*")
	headers.Set(web.HeaderCorsAllowHeaders, "*")
}

func generateCookie() string {
	buf := make([]byte, CookieGeneratedSize/2)

	if _, err := rand.Read(buf); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to generate randomness for a cookie!"
			k.Payload = err
		})
	}

	cookie := fmt.Sprintf("%x", buf)

	return cookie
}

// sendEndpointLogin to the user, after creating it and serialising it
func sendEndpointLogin(w io.Writer, cookieName string, expiration uint64) error {
	endpointLoginReturn := EndpointLoginReturn{
		CookieName: cookieName,
		Expiration: expiration,
	}

	err := json.NewEncoder(w).Encode(endpointLoginReturn)

	if err != nil {
		return fmt.Errorf(
			"Failed to send the endpoint login return JSON! %v",
			err,
		)
	}

	return nil
}
