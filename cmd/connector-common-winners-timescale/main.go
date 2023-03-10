// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
)

func main() {
	queue.WinnersAll(func(winner database.Winner) {
		log.Debug(func(k *log.Log) {
			k.Format("Inserting winner %v", winner)
		})

		database.InsertWinner(winner)
	})
}
