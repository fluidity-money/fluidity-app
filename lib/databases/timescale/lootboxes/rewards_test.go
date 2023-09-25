package lootboxes

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestBuildUserRewardValuesString(t *testing.T) {
	expectedRewardStrings := []string{
		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none')`,

		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 1, 20, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 2, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 3, 2, 'none')`,

		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 1, 20, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 2, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 3, 2, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 1, 15, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 2, 3, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 3, 1, 'none')`,

		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 1, 20, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 2, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 3, 2, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 1, 15, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 2, 3, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 3, 1, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 1, 12, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 2, 1, 'none')`,

		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 1, 20, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 2, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 3, 2, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 1, 15, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 2, 3, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 3, 1, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 1, 12, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 2, 1, 'none'),
($6, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')`,

		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 1, 20, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 2, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 3, 2, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 1, 15, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 2, 3, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 3, 1, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 1, 12, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 2, 1, 'none'),
($6, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($7, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')`,

		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 1, 20, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 2, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 3, 2, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 1, 15, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 2, 3, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 3, 1, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 1, 12, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 2, 1, 'none'),
($6, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($7, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($8, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')`,

		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 1, 20, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 2, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 3, 2, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 1, 15, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 2, 3, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 3, 1, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 1, 12, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 2, 1, 'none'),
($6, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($7, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($8, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($9, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')`,

		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 1, 20, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 2, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 3, 2, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 1, 15, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 2, 3, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 3, 1, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 1, 12, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 2, 1, 'none'),
($6, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($7, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($8, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($9, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($10, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')`,

		`($2, '', 'leaderboard_prize', $1, 0, 1, 30, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 2, 10, 'none'),
($2, '', 'leaderboard_prize', $1, 0, 3, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 1, 20, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 2, 5, 'none'),
($3, '', 'leaderboard_prize', $1, 0, 3, 2, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 1, 15, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 2, 3, 'none'),
($4, '', 'leaderboard_prize', $1, 0, 3, 1, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 1, 12, 'none'),
($5, '', 'leaderboard_prize', $1, 0, 2, 1, 'none'),
($6, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($7, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($8, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($9, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($10, '', 'leaderboard_prize', $1, 0, 1, 10, 'none'),
($11, '', 'leaderboard_prize', $1, 0, 1, 10, 'none')`,
	}

	for i, expectedString := range expectedRewardStrings {
		userCount := i + 1
		rewardString, err := buildUserRewardValuesString(userCount)

		require.NoError(t, err)
		assert.Equal(t, expectedString, rewardString)
	}

	rewardString, err := buildUserRewardValuesString(0)
	assert.Empty(t, rewardString)
	assert.Error(t, err)

	rewardString, err = buildUserRewardValuesString(11)
	assert.Empty(t, rewardString)
	assert.Error(t, err)
}
