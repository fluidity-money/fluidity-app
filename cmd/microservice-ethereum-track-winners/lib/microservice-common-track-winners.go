package microservice_common_track_winners

import (
	"fmt"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
	"time"
)

const NetworkEthereum = `ethereum`

// DecodeWinner, returning the internal definition for a winner
func DecodeWinner(contractAddress, transactionHash, winnerAddress_, transferAmount_ string, when time.Time) (*winners.Winner, error) {
	var (
		winnerAddress = ethCommon.HexToAddress(winnerAddress_)
		transferAmountAddress = ethCommon.HexToHash(transferAmount_)
	)

	transferAmount := transferAmountAddress.Big()

	if transferAmount == nil {
		return nil, fmt.Errorf(
			"Returned big.Int was nil when decoding a transfer amount!",
		)
	}

	winnerAddressHex := winnerAddress.Hex()

	winner := winners.Winner{
		Network:         NetworkEthereum,
		TransactionHash: transactionHash,
		WinnerAddress:   winnerAddressHex,
		WinningAmount:   misc.NewBigInt(*transferAmount),
		AwardedTime:     when,
	}

	return &winner, nil
}
