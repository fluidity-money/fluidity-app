package api_fluidity_money

import (
	"encoding/json"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

type RequestPendingRewards struct {
	Address string `json:"address"`
}

func HandlePendingRewards(w http.ResponseWriter, r *http.Request) interface{} {
	var (
		ipAddress = web.GetIpAddress(r)
		request   RequestPendingRewards
	)

	err := json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		log.App(func(k *log.Log) {
			k.Format(
				"Failed to decode a user's JSON request from ip %v for /pending-rewards!",
				ipAddress,
			)

			k.Payload = err
		})

		return returnForbidden(w)
	}

	address := request.Address

	return spooler.GetPendingRewardsForAddress(address)
}

