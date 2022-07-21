// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package main

import (
	database "github.com/fluidity-money/fluidity-app/lib/databases/postgres/prize-pool"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
)

func main() {
	queue.PrizePoolUpdatesAll(database.InsertPrizePool)
}
