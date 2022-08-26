package main

import (
	"github.com/fluidity-money/fluidity-app/web/ethereum.fluidity.money/lib-backend"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"github.com/fluidity-money/fluidity-app/lib/web/websocket"
)

const (
	// EnvWorkerKeyList to read supported tokend and their associated
	// private keys for signing random numbers with
	EnvWorkerKeyList = `FLU_ETHEREUM_WORKER_PRIVATE_KEY_LIST`

	// EnvChainId of the chain this api is running for
	// to properly nonce manual rewards
	EnvChainId = `FLU_ETHEREUM_CHAIN_ID`

	// EnvTokenList to fetch the contract address
	// to properly nonce manual rewards
	EnvTokenList = `FLU_ETHEREUM_TOKENS_LIST`
)

func main() {
	var (
		keys   = mustParseKeyListFromEnv(EnvWorkerKeyList)
		tokens = mustParseTokenNamesFromEnv(EnvTokenList)

		chainidString = util.GetEnvOrFatal(EnvChainId)
	)

	chainid, err := misc.BigIntFromString(chainidString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse chainid from env!"
			k.Payload = err
		})
	}

	updateMessagesEthereum := make(chan interface{})

	web.JsonEndpoint("/prize-pool", api_fluidity_money.HandlePrizePool)

	web.JsonEndpoint("/prize-board", api_fluidity_money.HandlePrizeBoard)

	web.JsonEndpoint("/past-winnings", api_fluidity_money.HandlePastWinnings)

	web.JsonEndpoint("/my-history", api_fluidity_money.HandleMyHistory)

	web.JsonEndpoint("/winning-chances", api_fluidity_money.HandleWinningChances)

	web.JsonEndpoint("/pending-rewards", api_fluidity_money.HandlePendingRewards)

	manualRewardHandler := api_fluidity_money.GetManualRewardHandler(tokens, chainid, keys)

	web.JsonEndpoint("/manual-reward", manualRewardHandler)

	updateNotificationsHandlerEthereum := api_fluidity_money.HandleUpdateNotifications(
		updateMessagesEthereum,
	)

	websocket.Endpoint("/updates", updateNotificationsHandlerEthereum)

	go func() {
		winners.WinnersEthereum(func(winner winners.Winner) {
			updateMessagesEthereum <- Update{
				Winner: &winner,
			}
		})
	}()

	go func() {
		user_actions.UserActionsEthereum(func(userAction user_actions.UserAction) {
			updateMessagesEthereum <- Update{
				UserAction: &userAction,
			}
		})
	}()

	go func() {
		prize_pool.PrizePoolUpdatesEthereum(func(prizePool prize_pool.PrizePool) {
			updateMessagesEthereum <- Update{
				PrizePool: &prizePool,
			}
		})
	}()

	web.Listen()
}
