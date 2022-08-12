package main

import (
	"encoding/json"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/gagliardetto/solana-go"
)

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

func redisGetTvl() (tvl uint64, isSet bool, err error) {
	bytes := state.Get(RedisTvlKey)

	if len(bytes) == 0 {
		return 0, false, nil
	}

	if err := json.Unmarshal(bytes, &tvl); err != nil {
		return 0, false, fmt.Errorf(
			"failed to decode the tvl (%#v): %v",
			string(bytes),
			err,
		)
	}

	return tvl, true, nil
}
