// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package web

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

// mock headers
type W struct {
	H        map[string][]string
	response *http.Response
}

func (w W) Header() http.Header {
	return w.H
}

func (w W) Write(b []byte) (int, error) {
	return 0, nil
}

func (w W) WriteHeader(statusCode int) {
	w.response.StatusCode = statusCode
}

func TestSetCorsHeaders(t *testing.T) {

	w := W{
		H: make(map[string][]string),
	}

	setCorsHeaders(w)

	allowOrigin := w.Header().Get(HeaderCorsAllowOrigin)
	allowHeaders := w.Header().Get(HeaderCorsAllowHeaders)

	assert.Equal(t, "*", allowOrigin,
		fmt.Sprintf(
			"setCorsHeaders() set %v to %v, want match for '*'!",
			HeaderCorsAllowOrigin,
			allowOrigin,
		),
	)

	assert.Equal(t, "*", allowHeaders,
		fmt.Sprintf(
			"setCorsHeaders() set %v to %v, want match for '*'!",
			HeaderCorsAllowHeaders,
			allowHeaders,
		),
	)
}

func TestReturnStatus(t *testing.T) {
	w := W{
		H:        make(map[string][]string),
		response: &http.Response{},
	}

	statusCode := 500

	returnStatus(w, statusCode)

	assert.Equal(t, statusCode, w.response.StatusCode,
		fmt.Sprintf(
			"returnStatus() set response.StatusCode to %v, want match for %v!",
			w.response.StatusCode,
			statusCode,
		),
	)
}
