package spooler

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

// flushes the reward queue, returning the batch to send
func GetRewards(dbNetwork network.BlockchainNetwork, token token_details.TokenDetails) (worker.EthereumSpooledRewards, error) {
	transactions := spooler.GetAndRemoveRewardsForToken(dbNetwork, token)

	if len(transactions) == 0 {
		return worker.EthereumSpooledRewards{}, fmt.Errorf(
			"Trying to send rewards with nothing in database for token %+v!",
			token,
		)
	}

	firstBlock, lastBlock, spooledRewards, err := BatchWinnings(transactions, token)

	if err != nil {
		return worker.EthereumSpooledRewards{}, fmt.Errorf(
			"Failed to batch rewards! %w",
			err,
		)
	}

	rewards := worker.EthereumSpooledRewards{
		Network:    dbNetwork,
		Token:      token,
		FirstBlock: &firstBlock,
		LastBlock:  &lastBlock,
		Rewards:    spooledRewards,
	}

	return rewards, nil
}
