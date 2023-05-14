package addresslinker

import (
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

// LinkedAddresses connects an address a user owns
// to an owner on another network
type LinkedAddresses struct {
	// Address is owned by the user on another network
	Address ethereum.Address `json:"address"`

	// Owner is owned by the user on this network
	Owner ethereum.Address `json:"owner"`

	// Network is the network that the user owns the Owner address
	Network network.BlockchainNetwork `json:"network"`
}
