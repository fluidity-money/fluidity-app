package main

import (
	"time"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	winnersDb "github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	winnersQueue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
)

func processReward(contractAddress ethereum.Address, transactionHash ethereum.Hash, data fluidity.RewardData, tokenDetails token_details.TokenDetails, network network.BlockchainNetwork) {
	var (
		winnerString  = data.Winner.String()
		winnerAddress = ethereum.AddressFromString(winnerString)
		startBlock    = *data.StartBlock
		endBlock      = *data.EndBlock
	)

	blocked := data.Blocked

	if blocked {
		blockedWinner := convertBlockedWinner(
			contractAddress,
			transactionHash,
			winnerAddress,
			data,
			tokenDetails,
			network,
		)

		queue.SendMessage(winnersQueue.TopicBlockedWinnersEthereum, blockedWinner)

		return
	}

	winners := winnersDb.GetAndRemovePendingRewardData(
		network,
		tokenDetails,
		startBlock,
		endBlock,
		winnerAddress,
	)

	convertedWinners := convertWinners(
		winners,
		transactionHash,
		winnerAddress,
		data,
		network,
		tokenDetails,
		time.Now(),
	)

	sendRewards(winnersQueue.TopicWinnersEthereum, convertedWinners)
}

func processUnblockedReward(transactionHash ethereum.Hash, data fluidity.UnblockedRewardData, tokenDetails token_details.TokenDetails, network network.BlockchainNetwork) {
	var (
		rewardData               = data.RewardData
		winnerString             = rewardData.Winner.String()
		startBlock               = *rewardData.StartBlock
		endBlock                 = *rewardData.EndBlock

		winnerAddress = ethereum.AddressFromString(winnerString)
	)

	rewards := winnersDb.GetAndRemovePendingRewardData(
		network,
		tokenDetails,
		startBlock,
		endBlock,
		winnerAddress,
	)

	convertedWinners := convertWinners(
		rewards,
		transactionHash,
		winnerAddress,
		rewardData,
		network,
		tokenDetails,
		time.Now(),
	)

	sendRewards(winnersQueue.TopicWinnersEthereum, convertedWinners)
}

func sendRewards(topic string, rewards []winnersDb.Winner) {
	for _, reward := range rewards {
		queue.SendMessage(winnersQueue.TopicWinnersEthereum, reward)
	}
}

// Convert, returning the internal definition for a winner
func convertWinners(pendingRewards []winnersDb.PendingRewardData, transactionHash ethereum.Hash, address ethereum.Address, rewardData fluidity.RewardData, network network.BlockchainNetwork, details token_details.TokenDetails, when time.Time) []winnersDb.Winner {
	var (
		hashString     = transactionHash.String()
		addressString  = address.String()
		amount         = *rewardData.Amount
		startBlock     = *rewardData.StartBlock
		endBlock       = *rewardData.StartBlock
	)

	winners := make([]winnersDb.Winner, len(pendingRewards))

	for i, pendingReward := range pendingRewards {
		var (
			appString      = pendingReward.Application.String()
			sendHashString = pendingReward.SendHash.String()
			rewardType     = pendingReward.RewardType
		)

		winners[i] = winnersDb.Winner{
			Application:         appString,
			Network:             network,
			TransactionHash:     hashString,
			SendTransactionHash: sendHashString,
			WinnerAddress:       addressString,
			WinningAmount:       amount,
			AwardedTime:         when,
			RewardType:          rewardType,
			BatchFirstBlock:     startBlock,
			BatchLastBlock:      endBlock,
			TokenDetails:        details,
		}
	}

	return winners
}

// Convert, returning the internal definition for a blocked winner
func convertBlockedWinner(contractAddress ethereum.Address, transactionHash ethereum.Hash, winnerAddress ethereum.Address, data fluidity.RewardData, tokenDetails token_details.TokenDetails, network network.BlockchainNetwork) winners.BlockedWinner {
	var (
		contractAddressString = contractAddress.String()
		transactionHashString = transactionHash.String()

		winnerString  = winnerAddress.String()
		winningAmount = data.Amount
		firstBlock    = data.StartBlock
		lastBlock     = data.EndBlock
	)

	blockedWinner := winners.BlockedWinner{
		Network:                 network,
		Token:                   tokenDetails,
		EthereumContractAddress: contractAddressString,
		RewardTransactionHash:   transactionHashString,
		WinnerAddress:           winnerString,
		WinningAmount:           *winningAmount,
		BatchFirstBlock:         *firstBlock,
		BatchLastBlock:          *lastBlock,
	}

	return blockedWinner
}
