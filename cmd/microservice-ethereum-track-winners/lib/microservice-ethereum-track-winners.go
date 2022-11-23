// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package microservice_ethereum_track_winners

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
)

const NetworkEthereum = `ethereum`

// Convert, returning the internal definition for a winner
func ConvertWinner(transactionHash string, rewardData fluidity.RewardData, details token_details.TokenDetails, when time.Time, rewardType winners.RewardType, application applications.Application) winners.Winner {
	var (
		address    = rewardData.Winner.String()
		amount     = *rewardData.Amount
		startBlock = *rewardData.StartBlock
		endBlock   = *rewardData.StartBlock
	)

	winner := winners.Winner{
		Network:                  NetworkEthereum,
		TransactionHash:          transactionHash,
		WinnerAddress:            address,
		SolanaWinnerOwnerAddress: address,
		WinningAmount:            amount,
		AwardedTime:              when,
		RewardType:               rewardType,
		BatchFirstBlock:          startBlock,
		BatchLastBlock:           endBlock,
		TokenDetails:             details,
	}

	return winner
}

func SendWinner(legacyWinners bool, topic string, winner winners.Winner) {
	if !legacyWinners {
		queue.SendMessage(topic, winner)
		return
	}

	var (
		address = winner.WinnerAddress
		shortName = winner.TokenDetails.TokenShortName
	)

	key := fmt.Sprintf("ethereum.legacy_winners.%s.%s", shortName, address)

	firstWinnerJson := state.Get(key)

	if len(firstWinnerJson) != 0 {
		// first winner exists, add them together and send the proper winner
		var firstWinner winners.Winner

		err := json.Unmarshal(firstWinnerJson, &firstWinner)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to read a winner from redis!"
				k.Payload = err
			})
		}

		winner.WinningAmount.Add(
			&winner.WinningAmount.Int,
			&firstWinner.WinningAmount.Int,
		)

		queue.SendMessage(topic, winner)
		state.Del(key)
		return
	}

	// first time we've seen this winner, add them to redis
	state.Set(key, winner)
}
