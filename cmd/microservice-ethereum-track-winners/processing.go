package main

import (
	"math"
	"math/big"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	winnersDb "github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	winnersQueue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
)

func lootboxUpdateTrackedRewardAmounts(lootboxCurrentEpoch string, network_ network.BlockchainNetwork, tokenDetails token_details.TokenDetails, winner winnersDb.Winner) {
	var (
		tokenShortName = tokenDetails.TokenShortName
		tokenDecimals  = tokenDetails.TokenDecimals

		application = winner.Application
		amountWon   = &winner.WinningAmount.Int
	)

	winnerAddress := ""

	// need to set it to the owner of the ATA if we're on solana!

	switch network_ {
	case network.NetworkSolana:
		winnerAddress = winner.SolanaWinnerOwnerAddress

	default:
		winnerAddress = winner.WinnerAddress
	}

	decimals := math.Pow10(tokenDecimals)

	amountNormal := new(big.Rat).SetInt(amountWon)
	amountNormal.Quo(amountNormal, new(big.Rat).SetInt64(int64(decimals)))

	amountNormalFloat, _ := amountNormal.Float64()

	lootboxes.UpdateOrInsertAmountsRewarded(
		network_,
		lootboxCurrentEpoch,
		tokenShortName,
		amountNormalFloat, // amount normal lossy
		winnerAddress,
		application,
	)
}

func processReward(contractAddress ethereum.Address, transactionHash ethereum.Hash, data fluidity.RewardData, tokenDetails token_details.TokenDetails, network network.BlockchainNetwork) {
	var (
		winnerString = data.Winner.String()
		startBlock   = *data.StartBlock
		endBlock     = *data.EndBlock
		blocked      = data.Blocked
	)

	winnerAddress := ethereum.AddressFromString(winnerString)

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

	_, lootboxHasBegun, lootboxCurrentEpoch, _ := lootboxes.GetLootboxConfig()

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

	if lootboxHasBegun {
		for _, winner := range convertedWinners {
			lootboxUpdateTrackedRewardAmounts(
				lootboxCurrentEpoch,
				network,
				tokenDetails,
				winner,
			)
		}
	}

	sendRewards(winnersQueue.TopicWinnersEthereum, convertedWinners)
}

func processUnblockedReward(transactionHash ethereum.Hash, data fluidity.UnblockedRewardData, tokenDetails token_details.TokenDetails, network network.BlockchainNetwork) {
	rewardData := data.RewardData

	var (
		winnerString = rewardData.Winner.String()
		startBlock   = *rewardData.StartBlock
		endBlock     = *rewardData.EndBlock

		winnerAddress = ethereum.AddressFromString(winnerString)
	)

	rewards := winnersDb.GetAndRemovePendingRewardData(
		network,
		tokenDetails,
		startBlock,
		endBlock,
		winnerAddress,
	)

	_, lootboxHasBegun, lootboxCurrentEpoch, _ := lootboxes.GetLootboxConfig()

	convertedWinners := convertWinners(
		rewards,
		transactionHash,
		winnerAddress,
		rewardData,
		network,
		tokenDetails,
		time.Now(),
	)

	if lootboxHasBegun {
		for _, winner := range convertedWinners {
			lootboxUpdateTrackedRewardAmounts(
				lootboxCurrentEpoch,
				network,
				tokenDetails,
				winner,
			)
		}
	}

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
		hashString    = transactionHash.String()
		addressString = address.String()
		startBlock    = *rewardData.StartBlock
		endBlock      = *rewardData.StartBlock
	)

	winners := make([]winnersDb.Winner, len(pendingRewards))

	for i, pendingReward := range pendingRewards {
		var (
			appString      = pendingReward.Application.String()
			utility        = pendingReward.Utility
			sendHashString = pendingReward.SendHash.String()
			rewardType     = pendingReward.RewardType
			winAmount      = pendingReward.WinAmount
			rewardTier     = pendingReward.RewardTier
			logIndex       = pendingReward.LogIndex
		)

		log.Debug(func(k *log.Log) {
			k.Format(
				"Converting a pending reward to winner with send hash %v, transaction hash %v, log index %v, application %v",
				sendHashString,
				hashString,
				logIndex.String(),
				appString,
			)
		})

		winners[i] = winnersDb.Winner{
			Application:             appString,
			Network:                 network,
			TransactionHash:         hashString,
			SendTransactionHash:     sendHashString,
			WinnerAddress:           addressString,
			WinningAmount:           winAmount,
			AwardedTime:             when,
			RewardType:              rewardType,
			BatchFirstBlock:         startBlock,
			BatchLastBlock:          endBlock,
			RewardTier:              rewardTier,
			TokenDetails:            details,
			Utility:                 utility,
			SendTransactionLogIndex: logIndex,
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
