package main

import (
	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
)

func main() {
	go queue.UserActionsEthereum(database.InsertUserAction)

	queue.BufferedUserActionsSolana(func(bufferedUserActions queue.BufferedUserAction) {
		for _, userAction := range bufferedUserActions.UserActions {
			database.InsertUserAction(userAction)
		}
	})
}
