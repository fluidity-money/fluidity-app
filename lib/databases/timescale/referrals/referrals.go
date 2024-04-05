package referrals

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	types "github.com/fluidity-money/fluidity-app/lib/types/referrals"
)

const (
	// Context to use for logging
	Context = `TIMESCALE/REFERRALS`

	// TableReferrals stores all referrals
	TableReferrals = `lootbox_referrals`
)

type Referral = types.Referral

// GetLatestUnclaimedReferrals by referee, sorted by date, limited by number
func GetEarliestUnclaimedReferrals(address ethereum.Address, epoch string, limit int) []Referral {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			referrer,
			referee,
			created_time,
			active,
			progress

		FROM %v
		WHERE referee = $1
		AND epoch = $2
		AND active = FALSE
		ORDER BY created_time ASC 
		LIMIT $3`,

		TableReferrals,
	)

	rows, err := timescaleClient.Query(
		statementText,
		address,
		epoch,
		limit,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get the latest unclaimed referrals with a count of %v!",
				limit,
			)

			k.Payload = err
		})
	}

	defer rows.Close()

	referrals := make([]Referral, 0)

	for rows.Next() {
		var (
			referral Referral
		)

		err := rows.Scan(
			&referral.Referrer,
			&referral.Referee,
			&referral.CreatedTime,
			&referral.Active,
			&referral.Progress,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of the latest referrals!"
				k.Payload = err
			})
		}

		referrals = append(referrals, referral)
	}

	return referrals
}

// GetClaimedReferrals of referee to distribute rewards to referrer
func GetClaimedReferrals(address ethereum.Address, epoch string) []Referral {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			referrer,
			referee,
			created_time,
			active,
			progress

		FROM %v
		WHERE referee = $1
		AND epoch = $2
		AND active = TRUE`,

		TableReferrals,
	)

	rows, err := timescaleClient.Query(
		statementText,
		address,
		epoch,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get claimed referrals!",
			)

			k.Payload = err
		})
	}

	defer rows.Close()

	referrals := make([]Referral, 0)

	for rows.Next() {
		var (
			referral Referral
		)

		err := rows.Scan(
			&referral.Referrer,
			&referral.Referee,
			&referral.CreatedTime,
			&referral.Active,
			&referral.Progress,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of the latest referrals!"
				k.Payload = err
			})
		}

		referrals = append(referrals, referral)
	}

	return referrals
}

func UpdateReferral(referral Referral, epoch string) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`UPDATE %v SET
			progress = $1,
			active = $2
		WHERE referrer = $3
		AND referee = $4
		AND epoch = $5`,

		TableReferrals,
	)

	_, err := timescaleClient.Exec(
		statementText,
		referral.Progress,
		referral.Active,
		referral.Referrer,
		referral.Referee,
		epoch,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to update a referral!",
			)

			k.Payload = err
		})
	}
}
