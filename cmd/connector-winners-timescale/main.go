package main

import (
	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
)

func main() {
	queue.WinnersAll(database.InsertWinner)
}
