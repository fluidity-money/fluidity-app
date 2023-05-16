// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package websocket

// websocket supports an easy-to-use websocket server and series of broadcast
// primitives.

import (
	"fmt"
	"net/http"
	"net/url"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"github.com/gorilla/websocket"
)

// Context to use when logging
const Context = `WEBSERVER/WEBSOCKET`

// websocketUpgrader used in every endpoint in this codebase.
var websocketUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Endpoint handles a HTTP request and upgrades it, giving the user a
// channel to receive messages down and a reply channel to send messages
// to the websocket.
func Endpoint(endpoint string, handler func(string, url.Values, <-chan []byte, chan<- []byte, chan<- error, <-chan bool)) {
	http.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		ipAddress := r.Header.Get(web.HeaderIpAddress)

		log.Debug(func(k *log.Log) {
			k.Context = Context
			k.Message = "Upgrading IP %v to a websocket!"
			k.Payload = ipAddress
		})

		websocketConn, err := websocketUpgrader.Upgrade(w, r, nil)

		if err != nil {
			err_ := fmt.Errorf(
				"Failed to handle a websocket upgrade! %#v",
				err,
			)

			log.App(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Websocket upgrade for IP %#v failed!",
					ipAddress,
				)

				k.Payload = err_
			})

			return
		}

		defer websocketConn.Close()

		var (
			messages = make(chan []byte, 1)
			replies  = make(chan []byte, 1)

			chanShutdownWriter = make(chan bool)

			chanHandlerRequestShutdown = make(chan error)

			chanHandlerShutdown = make(chan bool)
		)

		go func() {
			log.Debug(func(k *log.Log) {
				k.Context = Context
				k.Message = "Beginning to read messages!"
				k.Payload = ipAddress
			})

			for {
				_, content, err := websocketConn.ReadMessage()

				if err != nil {
					log.App(func(k *log.Log) {
						k.Context = Context

						k.Format(
							"Failed to read message from ip %#v websocket!",
							ipAddress,
						)

						k.Payload = err
					})

					log.Debug(func(k *log.Log) {
						k.Context = Context
						k.Message = "After an error with IP %#v, sending a message to chanHandlerShutdown..."
						k.Payload = ipAddress
					})

					chanHandlerShutdown <- true

					log.Debug(func(k *log.Log) {
						k.Context = Context
						k.Message = "After an error, sending a message to chanShutdownWriter..."
						k.Payload = ipAddress
					})

					chanShutdownWriter <- true

					return
				}

				log.Debug(func(k *log.Log) {
					k.Context = Context
					k.Message = "Sending a mesage to the replies channel!"
					k.Payload = ipAddress
				})

				replies <- content
			}
		}()

		go func() {
			for {
				select {
				case _ = <-chanShutdownWriter:
					log.Debug(func(k *log.Log) {
						k.Context = Context
						k.Message = "Received a message to shut down the writer!"
						k.Payload = ipAddress
					})

					return

				case message := <-messages:
					log.Debug(func(k *log.Log) {
						k.Context = Context
						k.Message = "Received a message to write!"
						k.Payload = ipAddress
					})

					err := websocketConn.WriteMessage(
						websocket.TextMessage,
						message,
					)

					if err != nil {
						log.App(func(k *log.Log) {
							k.Context = Context

							k.Format(
								"Failed to write a message to IP %#v websocket!",
								ipAddress,
							)

							k.Payload = err
						})

						chanHandlerShutdown <- true

						return
					}

					log.Debug(func(k *log.Log) {
						k.Context = Context
						k.Message = "Wrote a message to the websocket!"
						k.Payload = ipAddress
					})
				}
			}
		}()

		handler(
			ipAddress,
			r.URL.Query(),
			replies,
			messages,
			chanHandlerRequestShutdown,
			chanHandlerShutdown,
		)
	})
}
