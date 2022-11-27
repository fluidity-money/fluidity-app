package main

import (
	"time"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	winnersDb "github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	winnersQueue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
)

func processReward(contractAddress ethereum.Address, transactionHash ethereum.Hash, data fluidity.RewardData, tokenDetails token_details.TokenDetails, network network.BlockchainNetwork) {
	blocked := data.Blocked

	if blocked {
		blockedWinner := convertBlockedWinner(
			contractAddress,
			transactionHash,
			data,
			tokenDetails,
			network,
		)

		queue.SendMessage(winnersQueue.TopicBlockedWinnersEthereum, blockedWinner)

		return
	}

	var (
		winnerString  = data.Winner.String()
		winnerAddress = ethereum.AddressFromString(winnerString)
	)

	log.Debugf("GETTING NORMAL REWARD DATA %s", data.Winner.String())
	rewardType, application := winnersDb.GetAndRemovePendingRewardType(transactionHash, winnerAddress)

	convertedWinner := convertWinner(
		transactionHash,
		data,
		network,
		tokenDetails,
		time.Now(),
		rewardType,
		application,
	)

	queue.SendMessage(winnersQueue.TopicWinnersEthereum, convertedWinner)
}

func processUnblockedReward(transactionHash ethereum.Hash, data fluidity.UnblockedRewardData, tokenDetails token_details.TokenDetails, network network.BlockchainNetwork) {
	var (
		rewardData               = data.RewardData
		originalRewardHashString = data.OriginalRewardHash.String()
		winnerString             = rewardData.Winner.String()

		winnerAddress      = ethereum.AddressFromString(winnerString)
		originalRewardHash = ethereum.HashFromString(originalRewardHashString)
	)

	log.Debugf("GETTING UNBLOCKED REWARD DATA %s", rewardData.Winner.String())
	rewardType, application := winnersDb.GetAndRemovePendingRewardType(originalRewardHash, winnerAddress)

	convertedWinner := convertWinner(
		transactionHash,
		rewardData,
		network,
		tokenDetails,
		time.Now(),
		rewardType,
		application,
	)

	queue.SendMessage(winnersQueue.TopicWinnersEthereum, convertedWinner)
}

// Convert, returning the internal definition for a winner
func convertWinner(transactionHash ethereum.Hash, rewardData fluidity.RewardData, network network.BlockchainNetwork, details token_details.TokenDetails, when time.Time, rewardType winners.RewardType, application applications.Application) winnersDb.Winner {
	var (
		appString  = application.String()
		hashString = transactionHash.String()
		address    = rewardData.Winner.String()
		amount     = *rewardData.Amount
		startBlock = *rewardData.StartBlock
		endBlock   = *rewardData.StartBlock
	)

	winner := winnersDb.Winner{
		Application:     appString,
		Network:         network,
		TransactionHash: hashString,
		WinnerAddress:   address,
		WinningAmount:   amount,
		AwardedTime:     when,
		RewardType:      rewardType,
		BatchFirstBlock: startBlock,
		BatchLastBlock:  endBlock,
		TokenDetails:    details,
	}

	return winner
}

// Convert, returning the internal definition for a blocked winner
func convertBlockedWinner(contractAddress ethereum.Address, transactionHash ethereum.Hash, data fluidity.RewardData, tokenDetails token_details.TokenDetails, network network.BlockchainNetwork) winners.BlockedWinner {
	var (
		contractAddressString = contractAddress.String()
		transactionHashString = transactionHash.String()

		winnerString  = data.Winner.String()
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
