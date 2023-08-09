package reward_epoch

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/timescale"
	types "github.com/fluidity-money/fluidity-app/lib/types/reward-epoch"
)

const (
	// Context to use for logging
	Context = `TIMESCALE/REWARD_EPOCH`

	// TableRewardEpoch stores all RewardEpochs
	TableRewardEpoch = `reward_epoch`

	// TableRewardEpochApp stores all Applications related to RewardEpoch
	TableRewardEpochApp = `reward_epoch_application`
)

type (
	RewardEpoch            = types.RewardEpoch
	RewardEpochApplication = types.RewardEpochApplication
	NewRewardEpoch         = types.NewRewardEpoch
)

// GetCurrentRewardEpoch gets latest RewardEpoch in DB
func GetCurrentRewardEpoch() (*RewardEpoch, error) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			epoch_id,
			start_time,
			end_time

		FROM %v
		ORDER BY start_time DESC 
		LIMIT 1`,

		TableRewardEpoch,
	)

	rows, err := timescaleClient.Query(
		statementText,
	)

	if err != nil {
		return nil, fmt.Errorf("Failed to get current rewardEpoch! %v", err)
	}

	defer rows.Close()

	var rewardEpoch RewardEpoch

	for rows.Next() {
		err := rows.Scan(
			&rewardEpoch.EpochId,
			&rewardEpoch.StartTime,
			&rewardEpoch.EndTime,
		)

		if err != nil {
			return nil, fmt.Errorf("Failed to scan a row of rewardEpoch! %v", err)
		}
	}

	return &rewardEpoch, nil
}

// InsertRewardEpoch inserts new row to RewardEpoch
func InsertRewardEpoch(rewardEpoch NewRewardEpoch) error {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %v (
			start_time,
			end_time
		) VALUES (
			$1,
			$2
		) RETURNING (
			epoch_id,
			start_time,
			end_time
		)`,

		TableRewardEpoch,
	)

	_, err := timescaleClient.Exec(
		statementText,
		rewardEpoch.StartTime,
		rewardEpoch.EndTime,
	)

	if err != nil {
		return fmt.Errorf("Failed to insert NewRewardEpoch! %v", err)
	}

	return nil
}

// InsertRewardEpochApplications sequentially inserts new rows to RewardEpochApplications
func InsertRewardEpochApplications(epochId uint64, rewardEpoch NewRewardEpoch) error {
	timescaleClient := timescale.Client()

	for _, app := range rewardEpoch.Applications {

		statementText := fmt.Sprintf(
			`INSERT INTO %v (
			epoch_id,
			application	
		) VALUES (
			$1,
			$2
		)`,

			TableRewardEpochApp,
		)

		_, err := timescaleClient.Exec(
			statementText,
			epochId,
			app,
		)

		if err != nil {
			return fmt.Errorf(
				"Failed to insert RewardEpochApplication! %v",
				err,
			)
		}
	}

	return nil
}
