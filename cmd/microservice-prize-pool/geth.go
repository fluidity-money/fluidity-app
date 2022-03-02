package main

// geth connects to Geth, causing Fatal to happen if a connection fails.

import (
	"github.com/fluidity-money/fluidity-app/lib/log"

	"github.com/ethereum/go-ethereum/ethclient"
)

func getGethClient(address string) *ethclient.Client {
	client, err := ethclient.Dial(address)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth!"
			k.Payload = err
		})
	}

	return client
}
