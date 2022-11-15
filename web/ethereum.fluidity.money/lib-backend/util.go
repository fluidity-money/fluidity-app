// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package api_fluidity_money

import (
	"math/big"
	"net/http"

	"github.com/graphql-go/graphql/gqlerrors"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

func returnForbidden(w http.ResponseWriter) interface{} {
	w.WriteHeader(http.StatusForbidden)
	return nil
}

func validArgFloat64toBigrat(args map[string]interface{}, key string) (*big.Rat, bool) {
	val_, ok := args[key]
	if !ok {
		return nil, false
	}

	val, ok := val_.(float64)
	if !ok {
		return nil, false
	}

	return new(big.Rat).SetFloat64(val), true
}

func validArgInt64toUInt64Bigrat(args map[string]interface{}, key string) (*big.Rat, bool) {
	val_, ok := args[key]
	if !ok {
		return nil, false
	}

	val, ok := val_.(int)
	if !ok || val < 0 {
		return nil, false
	}

	uVal := uint64(val)
	return new(big.Rat).SetUint64(uVal), true
}

func validArgInt(args map[string]interface{}, key string) (int, bool) {
	val_, ok := args[key]
	if !ok {
		return 0, false
	}

	val, ok := val_.(int)
	if !ok {
		return 0, false
	}

	return val, true
}

func validArgString(args map[string]interface{}, key string) (string, bool) {
	val_, ok := args[key]
	if !ok {
		return "", false
	}

	val, ok := val_.(string)
	if !ok {
		return "", false
	}

	return val, true
}

func graphQLErrorLogHandler(w http.ResponseWriter, r *http.Request, msg []gqlerrors.FormattedError) {
	ipAddress := web.GetIpAddress(r)

	log.App(func(k *log.Log) {
		k.Format(
			"Failed to execute a GraphQL request from ip address %#v, %v",
			ipAddress,
			msg,
		)
	})

	w.WriteHeader(http.StatusBadRequest)
}
