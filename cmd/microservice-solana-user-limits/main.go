// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"encoding/json"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/solana"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

func main() {
	web.JsonEndpoint("/user-mint-limit", HandleUserMintLimit)
	web.JsonEndpoint("/user-amount-minted", HandleUserAmountMinted)
}

type RequestUserMintLimit struct {
    TokenName string `json:"token_short_name"`
}

type ResponseUserMintLimit struct {
    MintLimit float64 `json:"mint_limit"`
}

type RequestUserAmountMinted struct {
    Address   string `json:"address"`
    TokenName string `json:"token_short_name"`
}

type ResponseUserAmountMinted struct {
    AmountMinted float64 `json:"amount_minted"`
}

// HandleUserAmountMinted for the amount a user has minted of the requested token
func HandleUserAmountMinted(w http.ResponseWriter, r *http.Request) interface{} {
	var (
		ipAddress = web.GetIpAddress(r)
		request RequestUserAmountMinted
	)

	err := json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		log.App(func(k *log.Log) {
			k.Format(
				"Failed to decode a user's JSON request from ip %v for /my-mint-limit!",
				ipAddress,
			)

			k.Payload = err
		})

		w.WriteHeader(http.StatusForbidden)
		return nil
	}

    amountMinted := solana.GetUserAmountMinted(request.Address)

    response := ResponseUserAmountMinted{
        AmountMinted: amountMinted,
    } 

    return response
}

// HandleUserMintLimit for the per-user mint limit for the token
func HandleUserMintLimit(w http.ResponseWriter, r *http.Request) interface{} {
	var (
		ipAddress = web.GetIpAddress(r)
		request RequestUserMintLimit
	)

	err := json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		log.App(func(k *log.Log) {
			k.Format(
				"Failed to decode a user's JSON request from ip %v for /my-mint-limit!",
				ipAddress,
			)

			k.Payload = err
		})

        w.WriteHeader(http.StatusForbidden)
        return nil
	}

    mintLimit := solana.GetUserMintLimit(request.TokenName)

    response := ResponseUserMintLimit{
        MintLimit: mintLimit,
    } 

    return response
}
