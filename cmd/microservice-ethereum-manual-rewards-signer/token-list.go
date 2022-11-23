// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"crypto/ecdsa"
	"strings"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

func mustParseKeyListFromEnv(env string) map[string]*ecdsa.PrivateKey {
	listString := util.GetEnvOrFatal(env)

	keys := make(map[string]*ecdsa.PrivateKey)

	list := strings.Split(listString, ",")

	for _, entry := range list {
		details := strings.Split(entry, ":")

		if fields := len(details); fields != 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Invalid token list - expected shortname:prikey, got %d fields!",
					fields,
				)
			})
		}

		var (
			shortName    = details[0]
			prikeyString = details[1]
		)

		prikey, err := ethCrypto.HexToECDSA(prikeyString)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to parse private key from string!"
				k.Payload = err
			})
		}

		keys[shortName] = prikey
	}

	return keys
}

func mustParseTokenNamesFromEnv(env string) map[string]ethCommon.Address {
	listString := util.GetEnvOrFatal(env)

	tokens := ethereum.GetTokensListEthereum(listString)

	tokenLookup := make(map[string]ethCommon.Address, len(tokens))

	for _, token := range tokens {
		tokenLookup[token.TokenName] = token.FluidAddress
	}

	return tokenLookup
}
