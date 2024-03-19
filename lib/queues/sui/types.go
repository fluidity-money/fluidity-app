// Copyright 2024 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package sui

import "github.com/fluidity-money/fluidity-app/lib/types/sui"

// types contains types that are downloaded from Sui RPC and relayed
// down our message bus. These types are here for convenience.

type (
	Checkpoint        = sui.Checkpoint
	DecoratedTransfer = sui.SuiDecoratedTransfer
)
