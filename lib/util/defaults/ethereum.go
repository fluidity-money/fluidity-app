package defaults

import (
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util/env"
)

const (
	EnvGethHttpUrl = "FLU_ETHEREUM_HTTP_URL"
)

func EthereumHttpClientOrFatal() *ethclient.Client {
	address := env.GetEnvOrFatal(EnvGethHttpUrl)

	client, err := ethclient.Dial(address)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to connect to the geth http client!"
			k.Payload = err
		})
	}

	return client
}
