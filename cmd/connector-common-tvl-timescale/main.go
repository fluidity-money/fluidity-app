package main

import (
	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/tvl"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/ido"
)

func main() {
	queue.TvlUpdates(database.InsertTvl)
}
