// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package test_utils

import (
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"net/http/httptest"

	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

// from jsonrpc/server.go
type serverRequest struct {
	Method string           `json:"method"`
	Params *json.RawMessage `json:"params"`
	Id     *json.RawMessage `json:"id"`
}

type serverResponse struct {
	Id     *json.RawMessage `json:"id"`
	Result interface{}      `json:"result"`
	Error  interface{}      `json:"error"`
}

// contract method signature keccak hash
func methodSigHash(sig string) string {
	return crypto.Keccak256Hash([]byte(sig)).Hex()[:10]
}

func responseErr(response serverResponse, err interface{}) serverResponse {
	response.Error = err
	return response
}

// MockRpcClient to return an eth client connected to an endpoint that mocks the given methods.
// rpcMethods [methodName]response to provide a list of Ethereum RPC methods and how they should be mocked.
// callMethods[methodName]response to provide a list of eth_call contract methods and how they should respond.
func MockRpcClient(rpcMethods_ map[string]interface{}, callMethods_ map[string]interface{}) (*ethclient.Client, error) {
	var (
		// generate a random endpoint for the client
		endpoint = "/" + fmt.Sprint(rand.Uint64())

		// store methods internally - don't modify the ones passed
		callMethods = make(map[string]interface{})
		rpcMethods  = make(map[string]interface{})
	)

	for methodName, response := range callMethods_ {
		// hash method signatures
		hashedMethod := methodSigHash(methodName)
		callMethods[hashedMethod] = response
	}

	for methodName, response := range rpcMethods_ {
		rpcMethods[methodName] = response
	}

	web.JsonEndpoint(endpoint, func(rw http.ResponseWriter, r *http.Request) interface{} {
		var (
			request  serverRequest
			response serverResponse
			d        = json.NewDecoder(r.Body)
		)

		// decode request
		if err := d.Decode(&request); err != nil && err != io.EOF {
			return responseErr(response, err)
		}

		response.Id = request.Id

		// return expected response for that method, or failure if unimplemented
		if request.Method != "eth_call" {
			expectedResponse := rpcMethods[request.Method]

			if expectedResponse != nil {
				response.Result = expectedResponse
				return response
			} else {
				return responseErr(response, "Unsupported method")
			}
		}

		// process eth_call
		// decode data from the request
		var params_ []interface{}

		if err := json.Unmarshal(*request.Params, &params_); err != nil {
			return responseErr(response, err)
		}

		// convert to expected type
		params, ok := params_[0].(map[string]interface{})
		if !ok {
			return responseErr(response, "Failed to cast params!")
		}

		data, ok := params["data"].(string)
		if !ok {
			return responseErr(response, "Failed to cast data!")
		}

		// return the mocked result, if it's valid
		if len(data) >= 10 {
			expectedResult := callMethods[data[:10]]
			if expectedResult != nil {
				response.Result = expectedResult
			}
		}

		return response
	})

	server := httptest.NewServer(nil)
	return ethclient.Dial(server.URL + endpoint)
}
