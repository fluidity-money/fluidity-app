package main

import (
	"github.com/fluidity-money/fluidity-app/web/ethereum.fluidity.money/lib-backend"

	"github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"github.com/fluidity-money/fluidity-app/lib/web/websocket"
)

func main() {

	updateMessagesEthereum := make(chan interface{})

	web.JsonEndpoint("/prize-pool", api_fluidity_money.HandlePrizePool)

	web.JsonEndpoint("/prize-board", api_fluidity_money.HandlePrizeBoard)

	web.JsonEndpoint("/past-winnings", api_fluidity_money.HandlePastWinnings)

	web.JsonEndpoint("/my-history", api_fluidity_money.HandleMyHistory)

	web.JsonEndpoint("/winning-chances", api_fluidity_money.HandleWinningChances)

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
