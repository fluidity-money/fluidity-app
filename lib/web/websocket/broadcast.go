package websocket

import (
	"encoding/json"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

// ContextBroadcast used to identify the broadcast server in logging
const ContextBroadcast = "WEBSOCKET/BROADCAST"

type (
	// registration for a broadcast. If replies is nil, then it's assumed
	// that someone is unsubscribing!
	registration struct {
		cookieReply chan uint64
		replies     chan []byte
	}

	// Broadcast for sending messages to channels subscribing to events here
	Broadcast struct {
		broadcastRequests      chan []byte
		subscriptionRequests   chan registration
		unsubscriptionRequests chan uint64
		shutdownRequests       chan bool
		subscribedCount        uint64
		subscribed             map[uint64]chan []byte
	}
)

// NewBroadcast, creating a new map and new counter for messages and set
// up the server that handles new subscriptions.
func NewBroadcast() *Broadcast {
	var (
		broadcastRequests      = make(chan []byte)
		subscriptionRequests   = make(chan registration)
		unsubscriptionRequests = make(chan uint64)
		shutdownRequests       = make(chan bool)
	)

	broadcast := Broadcast{
		broadcastRequests:      broadcastRequests,
		subscriptionRequests:   subscriptionRequests,
		unsubscriptionRequests: unsubscriptionRequests,
		shutdownRequests:       shutdownRequests,
		subscribedCount:        0,
		subscribed:             make(map[uint64]chan []byte),
	}

	go func() {
		for {
			select {
			case message := <-broadcastRequests:

				log.Debug(func(k *log.Log) {
					k.Context = ContextBroadcast
					k.Message = "Received a message to broadcast!"
					k.Payload = string(message)
				})


				for cookie, subscribed := range broadcast.subscribed {

					if subscribed == nil {

						delete(broadcast.subscribed, cookie)

						continue
					}

					select {
					case subscribed <- message:
					default:
					}
				}

			case subscription := <-subscriptionRequests:
				var (
					cookieReply = subscription.cookieReply
					replies     = subscription.replies
				)

				previous := broadcast.incrementCookie()

				log.Debugf(
					"Received a request to subscribe with cookie %#v!",
					previous,
				)

				cookieReply <- previous

				log.Debugf(
					"Done sending a message with the cookie to the request to subscribe! %#v",
					previous,
				)

				broadcast.subscribed[previous] = replies

			case cookie := <-unsubscriptionRequests:
				log.Debugf(
					"Cookie %#v has sent a request to unsubscribe!",
					cookie,
				)

				broadcast.subscribed[cookie] = nil

			case _ = <-shutdownRequests:

				log.Debugf("Received a request to shutdown the broadcast server!")

				return
			}
		}
	}()

	return &broadcast
}

func (broadcast *Broadcast) incrementCookie() (previous uint64) {
	previous = broadcast.subscribedCount

	broadcast.subscribedCount++

	return previous
}

// Subscribe to the broadcast, with a new channel receiving messages
// being sent
func (broadcast Broadcast) Subscribe(messages chan []byte) uint64 {
	cookieChan := make(chan uint64)

	var subscriptionId int

	if log.DebugEnabled() {
		subscriptionId = generateSubscriptionId()
	}

	log.Debugf(
		"Subscribe to the channel request to receiving messages with subscription id %#v!",
		subscriptionId,
	)

	broadcast.subscriptionRequests <- registration{
		cookieReply: cookieChan,
		replies:     messages,
	}

	log.Debugf(
		"Received a response with subscription id %#v!",
		subscriptionId,
	)

	return <-cookieChan
}

func (broadcast Broadcast) Unsubscribe(cookie uint64) {
	broadcast.unsubscriptionRequests <- cookie
}

// Shutdown the broadcast, closing the inner worker and setting the struct
// to nil
func (broadcast *Broadcast) Shutdown() {
	broadcast.shutdownRequests <- true

	broadcast = nil
}

func (broadcast Broadcast) Broadcast(message []byte) {
	broadcast.broadcastRequests <- message
}

func (broadcast Broadcast) BroadcastJson(content interface{}) {
	blob, err := json.Marshal(content)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to encode an interface to JSON!"
			k.Payload = err
		})
	}

	broadcast.Broadcast(blob)
}
