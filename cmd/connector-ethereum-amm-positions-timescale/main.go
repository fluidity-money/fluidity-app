// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/amm"
	ammQueue "github.com/fluidity-money/fluidity-app/lib/queues/amm"
)

func main() {
	go ammQueue.PositionMintsEthereum(func(mint ammQueue.PositionMint) {
		amm.InsertAmmPosition(mint)
	})

	ammQueue.PositionUpdatesEthereum(func(update ammQueue.PositionUpdate) {
		amm.UpdateAmmPosition(update)
	})
}
