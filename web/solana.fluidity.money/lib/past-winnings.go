package api_fluidity_money

import (
	"net/http"

	"github.com/fluidity-money/microservice-lib/databases/timescale/past-winnings"
)

func HandlePastWinnings(w http.ResponseWriter, r *http.Request) interface{} {
	return past_winnings.GetPastWinnings(NetworkSolana, 30)
}
