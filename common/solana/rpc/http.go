// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package rpc

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

const LogContextHttp = "COMMON/SOLANA/HTTP"

type Http struct {
	http.Client
	url *url.URL
}

func NewHttp(url_ string) (*Http, error) {
	url, err := url.Parse(url_)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to create new http client: %v",
			err,
		)
	}

	var httpClient http.Client

	client := Http{
		url:    url,
		Client: httpClient,
	}

	return &client, nil
}

func (client Http) RawInvoke(method string, params interface{}) (json.RawMessage, error) {
	var buf bytes.Buffer

	err := json.NewEncoder(&buf).Encode(rpcRequest{
		JsonRpc: "2.0",
		Id:      1,
		Method:  method,
		Params:  params,
	})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to encode the method/param: %v",
			err,
		)
	}

	log.Debug(func(k *log.Log) {
		buf2 := buf

		k.Context = LogContextHttp

		k.Format(
			"Sending this message with method %v: %#v",
			method,
			string(buf2.String()),
		)
	})

	req, err := http.NewRequest("POST", "", &buf)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to make the request! %v",
			err,
		)
	}

	req.Header.Set("Content-Type", "application/json")

	req.URL = client.url

	resp, err := client.Do(req)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to make the request with the body given: %v",
			err,
		)
	}

	defer resp.Body.Close()

	var bodyBuf bytes.Buffer

	_, err = bodyBuf.ReadFrom(resp.Body)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to read the rpc response body: %v",
			err,
		)
	}

	log.Debug(func(k *log.Log) {
		bodyBuf2 := bodyBuf

		k.Context = LogContextHttp

		k.Format(
			"Received this message %#v as response!",
			string(bodyBuf2.Bytes()),
		)
	})

	var response rpcResponse

	err = json.NewDecoder(&bodyBuf).Decode(&response)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to decode the rpc response body: %v",
			err,
		)
	}

	if err := response.Err; err != nil {
		return nil, fmt.Errorf(
			"rpc error was not nil: %v, %+v",
			err,
			response,
		)
	}

	return response.Result, nil
}
