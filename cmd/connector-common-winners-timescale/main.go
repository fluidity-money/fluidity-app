// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/solana"
	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
)

func main() {
	go queue.WinnersEthereum(func(winner queue.Winner) {
		database.InsertWinner(winner)
	})

	queue.WinnersSolana(func(winner queue.Winner) {
		winningSignature := solana.GetIntermediateWinner(winner.TransactionHash)
		winner.SendTransactionHash = winningSignature
		database.InsertWinner(winner)
	})

	queue.WinnersSui(func(winner queue.Winner) {
		database.InsertWinner(winner)
	})
}
