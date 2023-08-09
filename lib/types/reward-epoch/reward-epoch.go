// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package reward_epoch

import "time"

type (
	// RewardEpoch is the window to scan past UserActions for leaderboard
	RewardEpoch struct {
		// EpochId of this RewardEpoch.
		// Set by the database!
		EpochId uint64 `json:"epoch_id"`

		// StartTime of RewardEpoch, inclusive
		StartTime time.Time `json:"start_time"`

		// endtime of rewardepoch, exclusive
		EndTime time.Time `json:"end_time"`
	}

	// RewardEpochApplication is relationally maps apps to RewardEpoch in DB
	RewardEpochApplication struct {
		// EpochId is FK to RewardEpoch.EpochId
		EpochId uint64 `json:"epoch_id"`

		// Application name
		Application string `json:"application"`
	}

	// NewRewardEpoch is used to write new RewardEpoch to DB
	NewRewardEpoch struct {
		// StartTime of RewardEpoch, inclusive
		StartTime time.Time `json:"start_time"`

		// StartTime of RewardEpoch, inclusive
		EndTime time.Time `json:"end_time"`

		// Applications is list of applications tracked in Epoch
		Applications []string `json:"applications"`
	}
)
