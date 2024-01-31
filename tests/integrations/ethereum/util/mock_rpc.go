// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package test_utils

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"net/http/httptest"
	"strings"

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
	response.Error = struct {
		Code    int         `json:"code"`
		Message string      `json:"message"`
		Data    interface{} `json:"data,omitempty"`
	}{
		Code: 999,
		Message: fmt.Sprintf("responding with err: %v", err),
		Data: err,
	}
	return response
}

// marshal then unescape json.Marshal's string encoding, so rpc responses aren't invalid
func marshalResponse(response serverResponse, rw http.ResponseWriter) {
	bytes, err := json.Marshal(response)
	if err != nil {
		panic(err)
	}
	resp_ := string(bytes)
	resp := strings.ReplaceAll(resp_, "\\", "")
	resp = strings.ReplaceAll(resp, "\"{", "{")
	resp = strings.ReplaceAll(resp, "}\"", "}")
	rw.Write([]byte(resp))
}

func marshalError(response serverResponse, rw http.ResponseWriter, err interface{}) {
	response = responseErr(response, err)
	marshalResponse(response, rw)
}

// MockRpcClient to return an eth client connected to an endpoint that mocks the given methods.
// rpcMethods [methodName]response to provide a list of Ethereum RPC methods and how they should be mocked.
// callMethods[methodName]response to provide a list of eth_call contract methods and how they should respond.
func MockRpcClient(rpcMethods_ map[string]interface{}, callMethods_ map[string]map[string]interface{}) (*ethclient.Client, error) {
	var (
		// generate a random endpoint for the client
		endpoint = "/" + fmt.Sprint(rand.Uint64())

		// store methods internally - don't modify the ones passed
		// method => calldata => response
		// or method => "" => response for defaults
		callMethods = make(map[string]map[string]interface{})
		rpcMethods  = make(map[string]interface{})
	)

	for methodName, responses := range callMethods_ {
		// hash method signatures
		hashedMethod := methodSigHash(methodName)

		method := make(map[string]interface{})

		for methodArgs, response := range responses {
			method[methodArgs] = response
		}

		callMethods[hashedMethod] = method
	}

	for methodName, response := range rpcMethods_ {
		rpcMethods[methodName] = response
	}

	web.Endpoint(endpoint, func(rw http.ResponseWriter, r *http.Request) {
		var (
			request  serverRequest
			response serverResponse
			d        = json.NewDecoder(r.Body)
		)

		// decode request
		if err := d.Decode(&request); err != nil && err != io.EOF {
			marshalError(response, rw, err)
			return
		}
		log.Printf("req %+v", string(*request.Params))

		response.Id = request.Id

		// return expected response for that method, or failure if unimplemented
		if method := request.Method; method != "eth_call" {
			expectedResponse := rpcMethods[method]

			if expectedResponse != nil {
				response.Result = expectedResponse
				marshalResponse(response, rw)
				return
			} else {
				msg := fmt.Sprintf("Unsupported method, was %v, need eth_call", method)
				marshalError(response, rw, msg)
				return
			}
		}

		// process eth_call
		// decode data from the request
		var params_ []interface{}

		if err := json.Unmarshal(*request.Params, &params_); err != nil {
			marshalError(response, rw, err)
			return
		}

		// convert to expected type
		params, ok := params_[0].(map[string]interface{})
		if !ok {
			marshalError(response, rw, "Failed to cast params!")
			return
		}

		data, ok := params["data"].(string)
		if !ok {
			marshalError(response, rw, "Failed to cast data!")
			return
		}

		// return the mocked result, if it's valid
		if len(data) >= 10 {
			method := callMethods[data[:10]]
			if method != nil {
				fullCalldata := method[data]
				methodName := method[""]

				log.Printf("fetching %s", data[:10])
				if fullCalldata != nil {
					response.Result = fullCalldata
					log.Printf(fmt.Sprintf("returning exact %s", fullCalldata))
				} else if methodName != nil {
					response.Result = methodName
					log.Printf(fmt.Sprintf("returning default %s", methodName))
				} else {
					log.Printf(fmt.Sprintf("no callmethod for calldata %s", data))
				}
			} else {
				log.Printf(fmt.Sprintf("no method for id %s, calldata %s", data[:10], data))
			}
		}

		// return response
		marshalResponse(response, rw)
		return
	})

	server := httptest.NewServer(nil)
	return ethclient.Dial(server.URL + endpoint)
}
