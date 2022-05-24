package microservice_common_track_winners

import (
	"time"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
)

const NetworkEthereum = `ethereum`

// DecodeWinner, returning the internal definition for a winner
func DecodeWinner(contractAddress, transactionHash string, rewardData fluidity.RewardData, when time.Time) (winners.Winner, winners.Winner) {
	var (
		fromAddress = rewardData.FromAddress.String()
		fromAmount = misc.NewBigInt(*rewardData.FromAmount)
		toAddress = rewardData.ToAddress.String()
		toAmount = misc.NewBigInt(*rewardData.ToAmount)
	)

	winner1 := winners.Winner{
		Network:         NetworkEthereum,
		TransactionHash: transactionHash,
		WinnerAddress:   fromAddress,
		WinningAmount:   fromAmount,
		AwardedTime:     when,
	}

	winner2 := winners.Winner{
		Network:         NetworkEthereum,
		TransactionHash: transactionHash,
		WinnerAddress:   toAddress,
		WinningAmount:   toAmount,
		AwardedTime:     when,
	}

	return winner1, winner2
}
