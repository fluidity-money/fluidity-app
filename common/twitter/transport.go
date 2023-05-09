// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package twitter

import (
	"fmt"
	"net/http"
)

type twitterBearerTransport struct {
	bearerToken string
}

func (transport *twitterBearerTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	bearerToken := fmt.Sprintf("Bearer %v", transport.bearerToken)

	req.Header.Add("Authorization", bearerToken)

	return http.DefaultTransport.RoundTrip(req)
}
