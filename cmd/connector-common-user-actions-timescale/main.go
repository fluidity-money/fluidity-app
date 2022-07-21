// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
