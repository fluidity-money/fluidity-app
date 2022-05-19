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
func Endpoint(endpoint string, handler func(string, url.Values, <-chan []byte, chan<- []byte, chan error, <-chan bool)) {
	http.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		ipAddress := r.Header.Get(web.HeaderIpAddress)

		log.Debugf(
			"Upgrading IP %v to a websocket!",
			ipAddress,
		)

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
			log.Debugf("Beginning to read messages from IP %#v!", ipAddress)

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

					log.Debugf(
						"After an error with IP %#v, sending a message to chanHandlerShutdown...",
						ipAddress,
					)

					chanHandlerShutdown <- true

					log.Debugf(
						"After an error with IP %#v, sending a message to chanShutdownWriter...",
						ipAddress,
					)

					chanShutdownWriter <- true

					return
				}

				log.Debugf(
					"Sending a mesage to the replies channel for IP %#v!",
					ipAddress,
				)

				replies <- content
			}
		}()

		go func() {
			for {
				select {
				case _ = <-chanShutdownWriter:
					log.Debugf(
						"Received a message to shut down the writer for IP %#v!",
						ipAddress,
					)

					return

				case message := <-messages:
					log.Debugf(
						"Received a message to write to IP %#v!",
						ipAddress,
					)

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

					log.Debugf(
						"Wrote a message to the websocket for IP %#v!",
						ipAddress,
					)
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
