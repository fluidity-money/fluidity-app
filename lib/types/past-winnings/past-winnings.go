package past_winnings

// past_winnings are the aggregated number of winners for a specific day

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

type PastWinnings struct {
	Network         network.BlockchainNetwork `json:"network"`
	WinningDate     time.Time                 `json:"winning_date"`
	AmountOfWinners uint64                    `json:"amount_of_winners"`
	WinningAmount   misc.BigInt               `json:"winning_amount"`
	TokenName       string                    `json:"token_name"`
}
