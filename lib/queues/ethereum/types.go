package ethereum

// types contains types that are downloaded from Ethereum geth and relayed
// down our message bus. These types are here for convenience.

import "github.com/fluidity-money/fluidity-app/lib/types/ethereum"

type (
	Log         = ethereum.Log
	BlockHeader = ethereum.BlockHeader
)
