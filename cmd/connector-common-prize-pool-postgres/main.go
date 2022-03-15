package main

import (
	database "github.com/fluidity-money/fluidity-app/lib/databases/postgres/prize-pool"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
)

func main() {
	queue.PrizePoolUpdatesAll(database.InsertPrizePool)
}
