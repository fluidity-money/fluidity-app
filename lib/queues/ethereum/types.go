// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

// types contains types that are downloaded from Ethereum geth and relayed
// down our message bus. These types are here for convenience.

import "github.com/fluidity-money/fluidity-app/lib/types/ethereum"

type (
	Log         = ethereum.Log
	BlockHeader = ethereum.BlockHeader
)
