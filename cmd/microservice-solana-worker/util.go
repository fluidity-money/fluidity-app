package main

import (
	"math/rand"

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

	pubkey := solana.MustPublicKeyFromBase58(pubkeyString)

	return pubkey
}