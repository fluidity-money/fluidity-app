package api_fluidity_money

import (
	"net/http"

	"github.com/fluidity-money/microservice-lib/databases/postgres/prize-pool"
)


func HandlePrizePool(w http.ResponseWriter, r *http.Request) interface{} {

	prizePool := prize_pool.GetPrizePool(NetworkSolana)

	if prizePool == nil {
		prizePool = new(prize_pool.PrizePool)
	}

	return prizePool
}
