package main

// geth connects to Geth, causing Fatal to happen if a connection fails.

import (
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/lib/log"
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
