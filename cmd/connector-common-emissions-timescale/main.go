package main

import (
	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/worker"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/worker"
)

func main() {
	queue.Emissions(database.InsertEmissions)
}
