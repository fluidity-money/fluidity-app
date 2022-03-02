package winners

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

type Winner struct {
 	Network                  network.BlockchainNetwork  `json:"network"`
 	TransactionHash          string                     `json:"transaction_hash"`
 	WinnerAddress            string                     `json:"winner_address"`
 	SolanaWinnerOwnerAddress string                     `json:"solana_winner_owner_address"`
 	WinningAmount            misc.BigInt                `json:"winning_amount"`
 	AwardedTime              time.Time                  `json:"awarded_time"`

	TokenDetails             token_details.TokenDetails `json:"token_details"`
}
