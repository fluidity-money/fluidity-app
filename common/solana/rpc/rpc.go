// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package rpc

import (
	"encoding/json"
	"fmt"
	"net/url"
)

// LogContextWebsocket to use for following errors
const LogContextWebsocket = "SOLANA/RPC/WEBSOCKET"

type (
	// RpcContext used for tracing the outcome of different uses of the RPC
	RpcContext struct {
		Context struct {
			Slot uint64 `json:"slot"`
		} `json:"context,omitempty"`
	}

	// rpcRequest that's sent to the RPC provider
	rpcRequest struct {
		Id      int         `json:"id"`
		JsonRpc string      `json:"jsonrpc"`
		Method  string      `json:"method"`
		Params  interface{} `json:"params,omitempty"`
	}

	rpcResponse struct {
		Id      int             `json:"id"`
		JsonRpc string          `json:"jsonrpc"`
		Result  json.RawMessage `json:"result"`
		Err     *rpcError       `json:"error,omitempty"`
	}

	rpcError struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}
)

type (
	providerUnderlying interface {
		RawInvoke(string, interface{}) (json.RawMessage, error)
	}

	// Provider supporting
	Provider struct {
		providerUnderlying
	}
)

// New rpc provider - wss? will use Websocket, https? will use Http
func New(url_ string) (*Provider, error) {
	url, err := url.Parse(url_)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to parse the url for the new rpc provider: %v",
			err,
		)
	}

	switch scheme := url.Scheme; scheme {
	case "http":
		fallthrough

	case "https":
		r, err := NewHttp(url_)

		if err != nil {
			return nil, err
		}

		p := Provider{r}

		return &p, nil

	case "ws":
		fallthrough

	case "wss":
		r, err := NewWebsocket(url_)

		if err != nil {
			return nil, err
		}

		p := Provider{r}

		return &p, nil

	default:
		return nil, fmt.Errorf(
			"unknown scheme, was %#v, was expecting (http?|wss?)",
			scheme,
		)
	}
}

// Invoke Solana RPC method
func (s Provider) RawInvoke(method string, body interface{}) (json.RawMessage, error) {
	message, err := s.providerUnderlying.RawInvoke(method, body)

	if err != nil {
		return nil, err
	}

	return message, nil
}
