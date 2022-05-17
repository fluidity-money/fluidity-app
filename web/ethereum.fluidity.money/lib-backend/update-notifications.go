package api_fluidity_money

import (
	"net/url"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web/websocket"
)

// HandleUpdateNotifications sends update notifications to every subscribed
// websocket client
func HandleUpdateNotifications(updates chan interface{}) func(string, url.Values, <-chan []byte, chan<- []byte, chan error, <-chan bool) {
	broadcast := websocket.NewBroadcast()

	go func() {
		for update := range updates {
			broadcast.BroadcastJson(update)
		}
	}()

	return func(ipAddress string, _ url.Values, websocketMessages <-chan []byte, replies chan<- []byte, shouldShutdown chan error, shutdown <-chan bool) {
		winningMessages := make(chan []byte)

		cookie := broadcast.Subscribe(winningMessages)

		for {
			select {
			case _ = <-websocketMessages:
				// we don't care about messages from the client side.

			case winningMessage := <-winningMessages:
				replies <- winningMessage

			case _ = <-shutdown:
				log.Debugf("Shutting down IP %#v!", ipAddress)

				broadcast.Unsubscribe(cookie)

				log.Debugf(
					"Done indicating to the broadcast server of the shutdown! %#v",
					ipAddress,
				)
			}
		}
	}
}
