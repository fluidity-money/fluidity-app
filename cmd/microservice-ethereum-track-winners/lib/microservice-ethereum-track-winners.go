package microservice_ethereum_track_winners

import (
	"encoding/json"
	"time"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/state"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
)

const NetworkEthereum = `ethereum`

// Convert, returning the internal definition for a winner
func ConvertWinner(transactionHash string, rewardData fluidity.RewardData, details token_details.TokenDetails, when time.Time) winners.Winner {
	var (
		address = rewardData.Winner.String()
		amount  = *rewardData.Amount
	)

	winner := winners.Winner{
		Network:         NetworkEthereum,
		TransactionHash: transactionHash,
		WinnerAddress:   address,
		WinningAmount:   amount,
		AwardedTime:     when,
		TokenDetails:    details,
	}

	return winner
}

func SendWinner(legacyWinners bool, topic string, winner winners.Winner) {
	if !legacyWinners {
		queue.SendMessage(topic, winner)
		return
	}

	key := winner.TokenDetails.TokenShortName + winner.WinnerAddress

	firstWinnerJson := state.Get(key)

	if len(firstWinnerJson) != 0 {
		// first winner exists, add them together and send the proper winner
		var firstWinner winners.Winner

		err := json.Unmarshal(firstWinnerJson, &firstWinner)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to read a winner from redis!"
				k.Payload = err
			})
		}

		winner.WinningAmount.Add(
			&winner.WinningAmount.Int,
			&firstWinner.WinningAmount.Int,
		)

		queue.SendMessage(topic, winner)
		state.Del(key)
		return
	}

	// first time we've seen this winner, add them to redis
	winnerBytes, err := json.Marshal(winner)

	if err != nil {
	    log.Fatal(func(k *log.Log) {
	        k.Message = "Failed to marshal a winner to json!"
	        k.Payload = err
	    })
	}

	state.Set(key, winnerBytes)
}
