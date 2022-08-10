package main

import (
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

func tokenListFromEnv(env string) map[string]string {
	tokenListString := util.GetEnvOrFatal(env)

	tokensMap := make(map[string]string)

	tokens := strings.Split(tokenListString, ",")

	for _, token := range tokens {
		tokenDetails := strings.Split(token, ":")

		if len(tokenDetails) != 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Unexpected token details format! Expected fluid:base, got %s",
					token,
				)
			})
		}

		var (
			fluid = tokenDetails[0]
			base  = tokenDetails[1]
		)

		tokensMap[fluid] = base
	}

	return tokensMap
}