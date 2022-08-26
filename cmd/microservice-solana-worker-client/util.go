package main

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/solana"
)

// pubkeyFromEnv gets and decodes a solana public key from an environment variable,
// panicking if the env doesn't exist or isn't a valid key
func pubkeyFromEnv(env string) solana.PublicKey {
	pubkeyString := util.GetEnvOrFatal(env)

	pubkey, err := solana.PublicKeyFromBase58(pubkeyString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to decode public key %s",
				env,
			)

			k.Payload = err
		})
	}

	return pubkey
}
