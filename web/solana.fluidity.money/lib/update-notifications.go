// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package api_fluidity_money

import (
	"encoding/json"
	"net/url"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web/websocket"
)

// HandleUpdateNotifications sends update notifications to every subscribed
// websocket client
func HandleUpdateNotifications(updates chan Update) func(string, url.Values, <-chan []byte, chan<- []byte, chan error, <-chan bool) {
	broadcast := websocket.NewBroadcast()

	go func() {
		for update := range updates {
			broadcast.BroadcastJson(update)
		}
	}()

	return func(ipAddress string, queryParams url.Values, websocketMessages <-chan []byte, replies chan<- []byte, shouldShutdown chan error, shutdown <-chan bool) {
		winningMessages := make(chan []byte)

		cookie := broadcast.Subscribe(winningMessages)

		// maintain a key for each user account we should send updates for
		userAccounts := make(map[string]bool)
		for _, accounts := range queryParams {
			for _, account := range accounts {
				userAccounts[account] = true
			}
		}

		for {
			select {
			case _ = <-websocketMessages:
				// we don't care about messages from the client side.

				shouldShutdown <- nil

			case winningMessage := <-winningMessages:
				// decode and check whether we should send the update to this client
				var update Update
				err := json.Unmarshal(winningMessage, &update)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Message = "Failed to unmarshal winning message!"
						k.Payload = err
					})
				}

				// only send user actions to relevant users
				if update.UserAction != nil {
					update.UserAction.RecipientAddress = update.UserAction.SolanaRecipientOwnerAddress
					update.UserAction.SenderAddress = update.UserAction.SolanaSenderOwnerAddress

					isRecipient := userAccounts[update.UserAction.RecipientAddress]
					isSender := userAccounts[update.UserAction.SenderAddress]

					if !isRecipient && !isSender {
						continue
					}
				}

				// finally, send the message
				replies <- winningMessage

			case _ = <-shutdown:
				broadcast.Unsubscribe(cookie)
			}
		}
	}
}
