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
			"failed to make the request wirth the body given: %v",
			err,
		)
	}

	defer resp.Body.Close()

	var response rpcResponse

	err = json.NewDecoder(resp.Body).Decode(&response)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to decode the rpc response body: %v",
			err,
		)
	}

	if err := response.Err; err != nil {
		return nil, fmt.Errorf(
			"rpc response was not nil: %v",
			err,
		)
	}

	return response.Result, nil
}
