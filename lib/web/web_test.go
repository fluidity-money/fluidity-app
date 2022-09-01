// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package web

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetIpAddress(t *testing.T) {
	requestIp := "127.0.0.2"

	request := httptest.NewRequest("GET", "/test", nil)
	request.Header.Set(HeaderIpAddress, requestIp)

	ip := GetIpAddress(request)
	assert.Equal(t, requestIp, ip)
}

func TestEndpoint(t *testing.T) {
	var (
		// Ports and endpoints
		listenAddr   = util.GetEnvOrFatal(EnvHttpListenAddress)
		endpoint     = "/test"
		authEndpoint = "/restricted"

		// Urls
		url     = "http://localhost" + listenAddr + endpoint
		authUrl = "http://localhost" + listenAddr + authEndpoint

		// Responses
		responseString              = "test http response string"
		authenticatedResponseString = "very secret response string"
	)

	// start server
	go func() {
		Endpoint(endpoint, func(rw http.ResponseWriter, r *http.Request) {
			fmt.Fprintf(rw, responseString)
		})

		AuthenticatedEndpoint(authEndpoint, "FLU_TEST_AUTH", func(s string) error {
			if s == "correct_auth" {
				return nil
			}
			return fmt.Errorf("Not Authenticated!")

		}, func(rw http.ResponseWriter, r *http.Request) {
			fmt.Fprintf(rw, authenticatedResponseString)
		})

		Listen()
	}()

	// test endpoint
	assert.Eventually(t, func() bool {
		client := http.DefaultClient
		r, err := client.Get(url)
		require.NoError(t, err)

		defer r.Body.Close()

		// check response and status
		require.Equal(t, http.StatusOK, r.StatusCode)

		responseBytes, err := ioutil.ReadAll(r.Body)
		require.NoError(t, err)
		assert.Equal(t, responseString, string(responseBytes))

		return true
	}, time.Second*2, time.Millisecond*10)

	// options
	assert.Eventually(t, func() bool {
		client := http.DefaultClient
		req, err := http.NewRequest(http.MethodOptions, url, nil)
		require.NoError(t, err)
		r, err := client.Do(req)
		require.NoError(t, err)

		defer r.Body.Close()
		// check status
		assert.Equal(t, http.StatusOK, r.StatusCode)

		return true
	}, time.Second*2, time.Millisecond*10)

	// authenticated endpoint
	// correct auth
	assert.Eventually(t, func() bool {
		client := http.DefaultClient

		req, err := http.NewRequest(http.MethodGet, authUrl, nil)
		require.NoError(t, err)
		req.Header.Set("FLU_TEST_AUTH", "correct_auth")
		r, err := client.Do(req)
		require.NoError(t, err)

		defer r.Body.Close()
		// check status
		assert.Equal(t, http.StatusOK, r.StatusCode)

		responseBytes, err := ioutil.ReadAll(r.Body)
		require.NoError(t, err)
		assert.Equal(t, authenticatedResponseString, string(responseBytes))

		return true
	}, time.Second*2, time.Millisecond*10)

	// incorrect auth
	assert.Eventually(t, func() bool {
		client := http.DefaultClient

		req, err := http.NewRequest(http.MethodGet, authUrl, nil)
		require.NoError(t, err)
		req.Header.Set("FLU_TEST_AUTH", "incorrect_auth")
		r, err := client.Do(req)
		require.NoError(t, err)

		// check status
		assert.Equal(t, http.StatusForbidden, r.StatusCode)

		return true
	}, time.Second*2, time.Millisecond*10)

	// options
	assert.Eventually(t, func() bool {
		client := http.DefaultClient
		req, err := http.NewRequest(http.MethodOptions, authUrl, nil)
		require.NoError(t, err)

		// don't set the header
		r, err := client.Do(req)
		require.NoError(t, err)

		defer r.Body.Close()
		// check status
		assert.Equal(t, http.StatusOK, r.StatusCode)

		return true
	}, time.Second*2, time.Millisecond*10)
}
