package spooler

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

// flushes the reward queue, returning the batch to send
func GetRewards(dbNetwork network.BlockchainNetwork, token token_details.TokenDetails) (worker.EthereumSpooledRewards, bool, error) {
	transactions := spooler.GetAndRemoveRewardsForCategory(dbNetwork, token)

	if len(transactions) == 0 {
		return worker.EthereumSpooledRewards{}, false, nil
	}

	firstBlock, lastBlock, spooledRewards, err := BatchWinnings(transactions, token.TokenShortName)

	if err != nil {
		return worker.EthereumSpooledRewards{}, false, fmt.Errorf(
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

	return rewards, true, nil
}
