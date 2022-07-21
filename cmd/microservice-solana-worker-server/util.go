package main

import (
	"math/big"
	"math/rand"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/gagliardetto/solana-go"
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

	pubkey, err := solana.PublicKeyFromBase58(pubkeyString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to get a public key from env %v, %#v",
				env,
				pubkeyString,
			)

			k.Payload = err
		})
	}

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
