package spooler

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

// flushes the reward queue, returning the batch to send
func GetRewards(dbNetwork network.BlockchainNetwork, token token_details.TokenDetails) ([]worker.EthereumSpooledRewards, bool, error) {
	transactions := spooler.GetAndRemoveRewardsForToken(dbNetwork, token)

	if len(transactions) == 0 {
		return nil, false, nil
	}

	spooledRewards, err := BatchWinningsByUser(transactions, token)

	if err != nil {
		return nil, false, fmt.Errorf(
			"Failed to batch rewards! %w",
			err,
		)
	}

	rewards := make([]worker.EthereumSpooledRewards, 0)

	for _, reward := range spooledRewards {
		rewards = append(rewards, reward)
	}

	return rewards, true, nil
}
