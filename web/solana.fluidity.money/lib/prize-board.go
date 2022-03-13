package api_fluidity_money

import (
	"net/http"

	"github.com/fluidity-money/microservice-lib/databases/timescale/winners"
)

func HandlePrizeBoard(w http.ResponseWriter, r *http.Request) interface{} {
	winnerList := winners.GetLatestWinners(NetworkSolana, 10)
	for i := range winnerList {
		winner := &winnerList[i]
		winner.WinnerAddress = winner.SolanaWinnerOwnerAddress
	}

	return winnerList
}
