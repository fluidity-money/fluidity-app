// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	addresslinker "github.com/fluidity-money/fluidity-app/common/ethereum/address-linker"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	addresslinkerQueue "github.com/fluidity-money/fluidity-app/lib/queues/address-linker"
	ethQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	addresslinkerTypes "github.com/fluidity-money/fluidity-app/lib/types/address-linker"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvAddressConfirmationContractAddr to get the address of the contract that confirms addresses from
	EnvAddressConfirmationContractAddr = `FLU_ETHEREUM_ADDRESS_CONFIRMATION_CONTRACT_ADDR`

	// EnvNetwork to differentiate between eth, arbitrum, etc
	EnvNetwork = `FLU_ETHEREUM_NETWORK`
)

func main() {
	var (
		addressConfirmerAddr_ = util.GetEnvOrFatal(EnvAddressConfirmationContractAddr)
		net_                  = util.GetEnvOrFatal(EnvNetwork)
	)

	network_, err := network.ParseEthereumNetwork(net_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to read an ethereum network from env!"
			k.Payload = err
		})
	}

	addressConfirmerAddr := ethTypes.AddressFromString(addressConfirmerAddr_)

	ethQueue.Logs(func(log_ ethQueue.Log) {
		if log_.Address != addressConfirmerAddr {
			return
		}

		addr, owner, err := addresslinker.DecodeAddressConfirmation(log_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to decode a log from the address confirmer service from transaction has %s and log index %v!",
					log_.TxHash.String(),
					log_.Index.String(),
				)

				k.Payload = err
			})
		}

		addrs := addresslinkerTypes.LinkedAddresses{
			Address: addr,
			Owner:   owner,
			Network: network_,
		}

		queue.SendMessage(addresslinkerQueue.TopicLinkedAddresses, addrs)
	})
}
