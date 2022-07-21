// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package main

import (
	"crypto/sha256"
	"fmt"
	"math"
	"math/rand"
	"regexp"
)

const UniquePhraseLength = 32

var (
	addressFilterEthereumCompiled = regexp.MustCompile("^0x[0-9A-Za-z]{40}$")
	addressFilterSolanaCompiled   = regexp.MustCompile("^[0-9A-Za-z]{43,44}$")
)

func filterAddressEthereum(address string) bool {
	return addressFilterEthereumCompiled.MatchString(address)
}

func filterAddressSolana(address string) bool {
	return addressFilterSolanaCompiled.MatchString(address)
}

func floatAsInt64(x float64) int64 {
	float := math.RoundToEven(x)

	return int64(float)
}

func generateUniqueAddressAndNonce(currentAddress string) (string, int) {

	nonce := rand.Intn(math.MaxInt)

	concatenated := fmt.Sprintf("%v.%v", currentAddress, nonce)

	address := sha256.Sum256([]byte(concatenated))

	addressHex := fmt.Sprintf("%x", string(address[:]))

	addressHexAbbreviated := addressHex[:UniquePhraseLength]

	return addressHexAbbreviated, nonce
}
