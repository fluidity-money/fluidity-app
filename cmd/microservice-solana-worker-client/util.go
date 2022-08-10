package main

import (
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/solana"
)

// pubkeyFromEnv gets and decodes a solana public key from an environment variable,
// panicking if the env doesn't exist or isn't a valid key
func pubkeyFromEnv(env string) solana.PublicKey {
	pubkeyString := util.GetEnvOrFatal(env)

	pubkey := solana.MustPublicKeyFromBase58(pubkeyString)

	return pubkey
}
