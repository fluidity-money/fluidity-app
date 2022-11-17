// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"crypto/rand"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/solana"
)

// generateRandomIntegers gated between min and max, doing some coercion
// internally to use crypto/rand and assuming that the uint32 requirement
// in the arguments prevent any size-of-int issues
func generateRandomIntegers(amount int, min, max uint32) (numbers []uint32) {
	var (
		maxBig = new(big.Int).SetInt64(int64(max))
		minBig = new(big.Int).SetInt64(int64(min))
	)

	// heuristic check that isn't perfect

	if int64(amount) > int64(max-min+1) {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Can't generate %d non-repeating integers between %d and %d!",
				amount,
				min,
				max,
			)
		})
	}

	numbers = make([]uint32, amount)

	for i := 0; i < amount; i++ {
		no, err := rand.Int(nil, maxBig)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to source system randomness in the worker server!"
				k.Payload = err
			})
		}

		for {
			no.Add(no, minBig)

			// we can assume that with the arguments this is okay

			numbers[i] = uint32(no.Int64())

			dup := false

			for j := 0; j < i; j++ {
				if numbers[i] == numbers[j] {
					dup = true
				}
			}

			if !dup {
				break
			}
		}
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

func sendEmission(emission *worker.Emission) {
	emission.Update()

	queue.SendMessage(worker.TopicEmissions, emission)

	log.Debugf("Emission: %s", emission)
}
