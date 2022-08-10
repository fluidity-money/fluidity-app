package microservice_ethereum_track_winners

import (
	"time"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
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
