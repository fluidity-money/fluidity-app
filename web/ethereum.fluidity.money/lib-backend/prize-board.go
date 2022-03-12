package api_fluidity_money

import (
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
)

func HandlePrizeBoard(w http.ResponseWriter, r *http.Request) interface{} {
	return winners.GetLatestWinners(NetworkEthereum, 10)
}
