package ethereum

// types contains types that are downloaded from Ethereum geth and relayed
// down our message bus. These types are here for convenience.

import "github.com/fluidity-money/fluidity-app/lib/types/ethereum"

type (
	BlockHeader = ethereum.BlockHeader
	Block       = ethereum.Block
	BlockBody   = ethereum.BlockBody
	Transaction = ethereum.Transaction
	Log         = ethereum.Log
)
