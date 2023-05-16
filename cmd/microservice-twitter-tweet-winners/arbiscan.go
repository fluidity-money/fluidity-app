// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type arbiscanResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Result  string `json:"result"`
}

func createUrlArbiscanGetAddressLabel(address, apikey string) (*url.URL, error) {
	u, err := url.Parse("https://api.arbiscan.io/api")

	if err != nil {
		return nil, fmt.Errorf("failed to create arbiscan url: %v", err)
	}

	q := u.Query()

	q.Set("module", "account")
	q.Set("action", "getlabel")
	q.Set("address", address)
	q.Set("apikey", apikey)

	return u, nil
}

func getArbiscanAddressLabel(address, apiKey string) (string, error) {
	u, err := createUrlArbiscanGetAddressLabel(address, apiKey)

	if err != nil {
		return "", fmt.Errorf("failed to create url: %v", err)
	}

	req, err := http.NewRequest("GET", "", nil)

	if err != nil {
		return "", fmt.Errorf(
			"failed to create the request to arbiscan: %v",
			err,
		)
	}

	req.URL = u

	var client http.Client

	resp, err := client.Do(req)

	if err != nil {
		return "", fmt.Errorf(
			"failed to send the request to arbiscan: %v",
			err,
		)
	}

	defer resp.Body.Close()

	var arbiscanResp arbiscanResponse

	err = json.NewDecoder(resp.Body).Decode(&arbiscanResp)

	if err != nil {
		return "", fmt.Errorf(
			"failed to decode arbiscan's response: %v",
			err,
		)
	}

	if arbiscanResp.Status == "1" {
		return arbiscanResp.Result, nil
	}

	return "", nil
}
