package rpc

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

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

func (client Http) RawInvoke(method string, params_ interface{}) (json.RawMessage, error) {
	var buf bytes.Buffer

	params, err := json.Marshal(params_)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to encode the rpc params: %v",
			err,
		)
	}

	err = json.NewEncoder(&buf).Encode(rpcBody{
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

	err = json.NewDecoder(resp.Body).Decode(&rpcBody)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to decode the rpc response body: %v",
			err,
		)
	}

	if err := rpcBody.Err; err != nil {
		return nil, fmt.Errorf(
			"rpc response was not nil: %v",
			err,
		)
	}

	return rpcBody.Params, nil
}
