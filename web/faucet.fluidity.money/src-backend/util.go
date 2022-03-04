package main

import (
	"regexp"
	"fmt"
	"math"
	"crypto/sha256"
	"math/rand"

	ethCommon "github.com/ethereum/go-ethereum/common"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

const UniquePhraseLength = 32

var addressFilterCompiled = regexp.MustCompile("^0x[0-9A-Za-z]{40}$")

func filterAddress(address string) bool {
	return addressFilterCompiled.Match([]byte(address))
}

func hexToAddress(str string) ethCommon.Address {
	return ethCommon.HexToAddress(str)
}

func floatAsInt64(x float64) int64 {
	float := math.RoundToEven(x)

	return int64(float)
}

func generateUniqueAddressAndNonce(currentAddress ethereum.Address) (string, int) {

	nonce := rand.Intn(math.MaxInt)

	concatenated := fmt.Sprintf("%v.%v", currentAddress, nonce)

	address := sha256.Sum256([]byte(concatenated))

	addressHex := fmt.Sprintf("%x", string(address[:]))

	addressHexAbbreviated := addressHex[:UniquePhraseLength]

	return addressHexAbbreviated, nonce
}
