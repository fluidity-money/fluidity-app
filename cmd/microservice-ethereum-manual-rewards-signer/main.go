package main

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

const (
	// EnvWorkerKeyList to read supported tokend and their associated
	// private keys for signing random numbers with
	EnvWorkerKeyList = `FLU_ETHEREUM_WORKER_PRIVATE_KEY_LIST`

	// EnvChainId of the chain this api is running for
	// to properly nonce manual rewards
	EnvChainId = `FLU_ETHEREUM_CHAIN_ID`

	// EnvTokenList to fetch the contract address
	// to properly nonce manual rewards
	EnvTokenList = `FLU_ETHEREUM_TOKENS_LIST`

	// EnvNetwork to differentiate between eth, arbitrum, etc
	EnvNetwork = `FLU_ETHEREUM_NETWORK`
)

func main() {
	var (
		keys   = mustParseKeyListFromEnv(EnvWorkerKeyList)
		tokens = mustParseTokenNamesFromEnv(EnvTokenList)

		networkId = util.GetEnvOrFatal(EnvNetwork)
		chainidString = util.GetEnvOrFatal(EnvChainId)
	)

	chainid, err := misc.BigIntFromString(chainidString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse chainid from env!"
			k.Payload = err
		})
	}

	net, err := network.ParseEthereumNetwork(networkId)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse network from env!"
			k.Payload = err
		})
	}

	pendingRewardsHandler := GetPendingRewardsHandler(net)

	web.JsonEndpoint("/pending-rewards", pendingRewardsHandler)

	manualRewardHandler := GetManualRewardHandler(net, tokens, chainid, keys)

	web.JsonEndpoint("/manual-reward", manualRewardHandler)

	web.Endpoint("/healthcheck", HandleHealthCheck)

	web.Listen()
}
