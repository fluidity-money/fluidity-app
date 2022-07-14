package api_fluidity_money

import (
	"encoding/json"
	"net/http"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
	typesEthereum "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
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

	var (
		addressString = request.Address
		address = typesEthereum.AddressFromString(addressString)
	)


	rewards := spooler.GetPendingRewardsForAddress(addressString)

	spooledRewards, err := ethereum.BatchWinningsByToken(rewards, address)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to batch rewards!"
			k.Payload = err
		})
	}

	return spooledRewards
}

