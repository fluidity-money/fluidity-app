package winners

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
)

const (
	// TableWinningTransactionAttributes to use when recording
	// winning transaction attributes to timescale
	TableWinningTransactionAttributes = `winning_transaction_attributes`
)

type TransactionAttributes struct {
	// Network that this event took place on
	Network network.BlockchainNetwork `json:"network"`

	// Application used in the event
	Application applications.Application `json:"application"`

	// TransactionHash to find the corresponding transaction for the event
	TransactionHash string `json:"transaction_hash"`

	// Sender of the event transaction
	Address string `json:"address"`

	// Amount that was swapped or sent
	Amount misc.BigInt `json:"amount"`

	// TokenDetails to include information on the token's name and the number
	// of decimal places contained within it
	TokenDetails token_details.TokenDetails `json:"token_details"`

	// RewardTier to indicate the tier of the payout [1-5]
	RewardTier int `json:"reward_tier"`
}

// InsertTransactionAttributes to store the attributes of a winning transaction
func InsertTransactionAttributes(transactionAttributes TransactionAttributes) {
	timescaleClient := timescale.Client()

	var (
		tokenShortName = transactionAttributes.TokenDetails.TokenShortName
		tokenDecimals  = transactionAttributes.TokenDetails.TokenDecimals
	)

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			token_short_name,
			token_decimals,
			network,
			address,
			transaction_hash,
			amount,
			reward_tier,
			application
		)

		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8
		)`,

		TableWinningTransactionAttributes,
	)

	_, err := timescaleClient.Exec(
		statementText,
		tokenShortName,
		tokenDecimals,
		transactionAttributes.Network,
		transactionAttributes.Address,
		transactionAttributes.TransactionHash,
		transactionAttributes.Amount,
		transactionAttributes.RewardTier,
		transactionAttributes.Application,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert transaction attributes!"
			k.Payload = err
		})
	}
}
