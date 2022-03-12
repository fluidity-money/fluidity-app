package main

import (
	queue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
)

func main() {
	queue.WinnersAll(database.InsertWinner)
}
