// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package network

import "fmt"

// blockchain networks that we currently support, hardcoded for the SQL constants

// BlockchainNetwork backend that we currently support
type BlockchainNetwork string

const (
	NetworkEthereum      BlockchainNetwork = `ethereum`
	NetworkArbitrum      BlockchainNetwork = `arbitrum`
	NetworkSolana        BlockchainNetwork = `solana`
	NetworkPolygonZk     BlockchainNetwork = `polygon_zk`
	NetworkStylusTestnet BlockchainNetwork = `stylus_testnet`
	NetworkSui			 BlockchainNetwork = `sui`
)

// ParseEthereumNetwork takes a network name as a string
// and tries to convert it to an ethereum BlockchainNetwork
func ParseEthereumNetwork(network_ string) (network BlockchainNetwork, err error) {
	switch network_ {
	case string(NetworkEthereum):
		network = NetworkEthereum
	case string(NetworkArbitrum):
		network = NetworkArbitrum
	case string(NetworkPolygonZk):
		network = NetworkPolygonZk
	case string(NetworkStylusTestnet):
		network = NetworkStylusTestnet
	case string(NetworkSui):
		network = NetworkSui
	default:
		err = fmt.Errorf(
			"Unknown network name '%s'",
			network_,
		)
	}

	return
}
