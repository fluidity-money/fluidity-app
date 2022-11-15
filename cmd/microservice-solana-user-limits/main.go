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
	web.JsonEndpoint("/my-mint-limit", HandleMyMintLimit)
}

type RequestMyMintLimit struct {
	Address   string `json:"address"`
	TokenName string `json:"token_short_name"`
}

type ResponseMyMintLimit struct {
	AmountMinted float64 `json:"amount_minted"`
	MintLimit    string  `json:"mint_limit"`
	TokenName    string  `json:"token_short_name"`
}

func HandleMyMintLimit(w http.ResponseWriter, r *http.Request) interface{} {
	var (
		ipAddress = web.GetIpAddress(r)
		request   RequestMyMintLimit
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
	limit := solana.GetUserMintLimit(request.TokenName)

	var (
		mintLimit = limit.MintLimit.String()
		tokenName = limit.TokenName
	)

	response := ResponseMyMintLimit{
		AmountMinted: amountMinted,
		TokenName:    tokenName,
		MintLimit:    mintLimit,
	}

	return response
}
