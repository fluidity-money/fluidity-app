package winners

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	ethApps "github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
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
			volume,
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
		transactionAttributes.Application.String(),
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert transaction attributes!"
			k.Payload = err
		})
	}
}

// GetTransactionAttributes to fetch the attributes of a winning user
func GetTransactionAttributes(address ethereum.Address) []TransactionAttributes {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			network,
			transaction_hash,
			address,
			volume,
			token_short_name,
			token_decimals,
			reward_tier,
			application

		FROM %v
		WHERE address = $1`,

		TableWinningTransactionAttributes,
	)

	rows, err := timescaleClient.Query(
		statementText,
		address,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get transaction attributes with address %v!",
				address,
			)

			k.Payload = err
		})
	}

	defer rows.Close()

	attributes := make([]TransactionAttributes, 0)

	for rows.Next() {
		var (
			transactionAttributes TransactionAttributes 
			applicationEthereum      string
		)

		err := rows.Scan(
			&transactionAttributes.Network,
			&transactionAttributes.TransactionHash,
			&transactionAttributes.Address,
			&transactionAttributes.Amount,
			&transactionAttributes.TokenDetails.TokenShortName,
			&transactionAttributes.TokenDetails.TokenDecimals,
			&transactionAttributes.RewardTier,
			&applicationEthereum,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of transaction attributes!"
				k.Payload = err
			})
		}

		var application ethApps.Application

		switch transactionAttributes.Network {
		case network.NetworkEthereum, network.NetworkArbitrum:
			application, err = ethApps.ParseApplicationName(applicationEthereum)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Context = Context
					k.Message = "Failed to convert application name into application!"
					k.Payload = err
				})
			}
		}

		transactionAttributes.Application = application

		attributes = append(attributes, transactionAttributes)
	}

	return attributes 
}
