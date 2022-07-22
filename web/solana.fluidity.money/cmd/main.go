package main

import (
	"github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"github.com/fluidity-money/fluidity-app/lib/web/websocket"
	"github.com/fluidity-money/fluidity-app/web/solana.fluidity.money/lib"
)

func main() {

	updateMessagesSolana := make(chan api_fluidity_money.Update)

	web.JsonEndpoint("/prize-pool", api_fluidity_money.HandlePrizePool)

	web.JsonEndpoint("/prize-board", api_fluidity_money.HandlePrizeBoard)

	web.JsonEndpoint("/past-winnings", api_fluidity_money.HandlePastWinnings)

	web.JsonEndpoint("/my-history", api_fluidity_money.HandleMyHistory)

	updateNotificationsHandlerSolana := api_fluidity_money.HandleUpdateNotifications(
		updateMessagesSolana,
	)

	websocket.Endpoint("/updates", updateNotificationsHandlerSolana)

	go func() {
		winners.WinnersSolana(func(winner winners.Winner) {
			winner.WinnerAddress = winner.SolanaWinnerOwnerAddress

			updateMessagesSolana <- api_fluidity_money.Update{
				Winner: &winner,
			}
		})
	}()

	go func() {
		user_actions.BufferedUserActionsSolana(func(bufferedUserAction user_actions.BufferedUserAction) {
			for _, userAction := range bufferedUserAction.UserActions {

				userAction.SenderAddress = userAction.SolanaSenderOwnerAddress
				userAction.RecipientAddress = userAction.SolanaRecipientOwnerAddress

				updateMessagesSolana <- api_fluidity_money.Update{
					UserAction: &userAction,
				}
			}
		})
	}()

	go func() {
		prize_pool.PrizePoolUpdatesSolana(func(prizePool prize_pool.PrizePool) {
			updateMessagesSolana <- api_fluidity_money.Update{
				PrizePool: &prizePool,
			}
		})
	}()

	web.Listen()
}
