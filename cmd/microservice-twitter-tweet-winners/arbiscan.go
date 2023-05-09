// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"net/http"
	"net/url"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

type arbiscanResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Result  string `json:"result"`
}

func createUrlArbiscanGetAddressLabel(address, apikey string) (*net.Url, error) {
	url_, err := url.Parse(address)

	if err != nil {
		return nil, fmt.Errorf("failed to create arbiscan url: %v", err)
	}

	q := url.Query()

	q.Set("module", "account")
	q.Set("action", "getlabel")
	q.Set("address", address)
	q.Set("apikey", apikey)

	return url_
}

func getArbiscanAddressLabel(address ethereum.Address, apiKey string) (string, error) {
	url_, err := createUrlArbiscanGetAddress(address.String(), apiKey)

	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("GET", "", nil)

	if err != nil {
		return "", fmt.Errorf(
			"failed to create the request to arbiscan: %v",
			err,
		)
	}

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
