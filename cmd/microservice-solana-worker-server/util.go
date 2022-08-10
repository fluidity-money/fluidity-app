package main

import (
	"math/big"
	"math/rand"

	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/solana"
)

func generateRandomIntegers(amount, min, max int) []int {
	numbers := make([]int, amount)

	for i := 0; i < amount; i++ {
		numbers[i] = min + rand.Intn(max)
	}

	return numbers
}

// pubkeyFromEnv gets and decodes a solana public key from an environment variable,
// panicking if the env doesn't exist or isn't a valid key
func pubkeyFromEnv(env string) solana.PublicKey {
	pubkeyString := util.GetEnvOrFatal(env)

	pubkey := solana.MustPublicKeyFromBase58(pubkeyString)

	return pubkey
}

func raiseDecimalPlaces(places int) *big.Rat {
	var (
		decimalPlacesRat = big.NewRat(1, 1)
		tenRat           = big.NewRat(10, 1)
	)

	for i := 0; i < places; i++ {
		decimalPlacesRat.Mul(decimalPlacesRat, tenRat)
	}

	return decimalPlacesRat
}
