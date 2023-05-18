// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"net/url"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"github.com/fluidity-money/fluidity-app/lib/web/websocket"
)

// EnvNetwork to match the endpoint for
const EnvNetwork = `FLU_ETHEREUM_NETWORK`

const (
	NotificationTypeOnchain = iota + 1
	NotificationTypeWinningReward
	NotificationTypeSend
	NotificationTypeSwapIn
	NotificationTypeSwapOut
)

// websocketNotification is received via websocket
type websocketNotification struct {
	Type            int    `json:"type"` // NotificationType
	Source          string `json:"source"`
	Destination     string `json:"destination"`
	Amount          string `json:"amount"`
	Token           string `json:"token"`
	TransactionHash string `json:"transaction_hash"`
	RewardType      string `json:"reward_type"`
}

type registration struct {
	address string
	reply   chan *websocket.Broadcast
}

func main() {
	network__ := util.GetEnvOrFatal(EnvNetwork)

	network_, err := network.ParseEthereumNetwork(network__)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse the Ethereum network!"
			k.Payload = err
		})
	}

	endpoint, err := url.JoinPath("/", string(network_))

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create network-centric URL!"
			k.Payload = err
		})
	}

	var (
		registrations       = make(chan registration)
		incomingWinners     = make(chan winners.Winner)
		incomingUserActions = make(chan user_actions.UserAction)
	)

	go func() {
		winners.WinnersEthereum(func(winner winners.Winner) {
			incomingWinners <- winner
		})
	}()

	go func() {
		user_actions.UserActionsEthereum(func(userAction user_actions.UserAction) {
			incomingUserActions <- userAction
		})
	}()

	go func() {
		clients := make(map[string]*websocket.Broadcast)

		for {
			select {
			case registration := <-registrations:
				var (
					address = registration.address
					reply   = registration.reply
				)

				broadcast := clients[address]

				if broadcast == nil {
					broadcast = websocket.NewBroadcast()
					clients[address] = broadcast
				}

				reply <- broadcast

			case winner := <-incomingWinners:
				var (
					winnerAddress   = cleanAddress(winner.WinnerAddress)
					winningAmount   = winner.WinningAmount
					tokenShortName  = winner.TokenDetails.TokenShortName
					tokenDecimals   = winner.TokenDetails.TokenDecimals
					transactionHash = winner.TransactionHash
					application     = winner.Application
				)

				broadcast := clients[winnerAddress]

				if broadcast == nil {
					continue
				}

				tokenDecimalsPow10 := pow10(tokenDecimals)

				amount := new(big.Rat).SetInt(&winningAmount.Int)

				amount.Quo(amount, tokenDecimalsPow10)

				broadcast.BroadcastJson(websocketNotification{
					Type:            NotificationTypeWinningReward,
					Destination:     winnerAddress,
					Amount:          amount.FloatString(2),
					Token:           tokenShortName,
					TransactionHash: transactionHash,
					RewardType:      application,
				})

			case userAction := <-incomingUserActions:
				// send to the sender and receiver

				var (
					typ              = userAction.Type
					transactionHash  = userAction.TransactionHash
					swapIn           = userAction.SwapIn
					senderAddress    = userAction.SenderAddress
					recipientAddress = userAction.RecipientAddress
					amount_          = userAction.Amount
					tokenShortName   = userAction.TokenDetails.TokenShortName
					tokenDecimals    = userAction.TokenDetails.TokenDecimals
				)

				var (
					senderBroadcast    = clients[senderAddress]
					recipientBroadcast = clients[recipientAddress]
				)

				tokenDecimalsPow10 := pow10(tokenDecimals)

				amount := new(big.Rat).SetInt(&amount_.Int)

				amount.Quo(amount, tokenDecimalsPow10)

				var notificationType int

				switch true {
				case typ == "send":
					notificationType = NotificationTypeSend

				case typ == "swap" && swapIn:
					notificationType = NotificationTypeSwapIn

				case typ == "swap" && !swapIn:
					notificationType = NotificationTypeSwapOut

				default:
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Unusual user action type received, notification type %#v",
							typ,
						)
					})
				}

				notification := websocketNotification{
					Type:            notificationType,
					Source:          senderAddress,
					Destination:     recipientAddress,
					Amount:          amount.FloatString(2),
					Token:           tokenShortName,
					TransactionHash: transactionHash,
				}

				if senderBroadcast != nil {
					senderBroadcast.BroadcastJson(notification)
				}

				if recipientBroadcast != nil {
					recipientBroadcast.BroadcastJson(notification)
				}
			}
		}
	}()

	websocket.Endpoint(endpoint, func(ipAddress string, query url.Values, incoming <-chan []byte, outgoing chan<- []byte, requestShutdown chan<- error, shutdown <-chan bool) {
		var (
			broadcast         *websocket.Broadcast
			broadcastMessages chan []byte
			cookie            uint64
		)

		for {
			select {
			case message := <-incoming:
				var address string

				if err := json.Unmarshal(message, &address); err != nil {
					log.App(func(k *log.Log) {
						k.Format(
							"User connecting from IP %v sent a weird message! %v",
							ipAddress,
							err,
						)
					})

					requestShutdown <- fmt.Errorf("bad message received")
					continue
				}

				reply := make(chan *websocket.Broadcast)

				registrations <- registration{
					address: address,
					reply:   reply,
				}

				newBroadcast := <-reply

				if cookie != 0 {
					broadcast.Unsubscribe(cookie)
				}

				cookie = newBroadcast.Subscribe(broadcastMessages)

				broadcast = newBroadcast

				outgoing <- []byte(`"ok"`)

			case message := <-broadcastMessages:
				outgoing <- message

			case shutdown := <-shutdown:
				if !shutdown {
					continue
				}

				if broadcast != nil {
					broadcast.Unsubscribe(cookie)
				}

				return
			}
		}
	})

	web.Endpoint("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "ok")
	})

	web.Listen()
}
