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
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
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
	NotificationTypePendingReward
)

// websocketNotification is received via websocket
type websocketNotification struct {
	Type            int    `json:"type"` // NotificationType
	Source          string `json:"source"`
	Destination     string `json:"destination"`
	Amount          string `json:"amount"`
	Token           string `json:"token"`
	TransactionHash string `json:"transactionHash"`
	RewardType      string `json:"rewardType"`
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
		registrations   = make(chan registration)
		incomingWinners = make(chan winners.Winner)
	)

	go func() {
		winners.WinnersEthereum(func(winner winners.Winner) {
			incomingWinners <- winner
		})
	}()

	go func() {
		clients := make(map[string]*websocket.Broadcast)

		for {
			select {
			case registration := <-registrations:
				address := strings.ToLower(registration.address)

				reply := registration.reply

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
					rewardType      = winner.RewardType
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
					RewardType:      string(rewardType),
				})
			}
		}
	}()

	websocket.Endpoint(endpoint, func(ipAddress string, query url.Values, incoming <-chan []byte, outgoing chan<- []byte, requestShutdown chan<- error, shutdown <-chan bool) {
		var (
			broadcast *websocket.Broadcast
			cookie    uint64
		)

		broadcastMessages := make(chan []byte)

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

				log.Debugf("broadcast %v", broadcast)

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
