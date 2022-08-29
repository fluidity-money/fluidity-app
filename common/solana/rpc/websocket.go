package rpc

// adjusted form of solana-go that benefits from the internal practices
// around logging.

// websocket first sends the connected user a "ticket" with their identifier
// and then sends them what it received from upstream

import (
	"encoding/json"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"

	"github.com/gorilla/websocket"
)

type (
	Websocket struct {
		invokeChan  chan websocketOutgoing
		shouldClose chan bool
	}

	// websocketOutgoingResponse to use to track the reply for the
	// message given and to tell the server to clean up memory for
	// tracking the id on our behalf
	websocketOutgoingResponse struct {
		id      int
		method  string
		params  json.RawMessage
		err     *rpcError
		cleanup chan int
	}

	// WebsocketOutgoing to send messages down with and to receive
	// a response
	websocketOutgoing struct {
		returnChannel chan websocketOutgoingResponse
		method        string
		params        interface{}
	}

	SubscriptionResponse struct {
		Jsonrpc string `json:"jsonrpc"`
		Result  int    `json:"result,omitempty"`
		Id      int    `json:"method"`
		Error   rpcError
	}

	Subscription struct {
		requestCloseChan chan bool
	}
)

func NewWebsocket(url string) (*Websocket, error) {
	var (
		// sent down when the user wants to send a message out
		outgoingMessagesChan = make(chan websocketOutgoing)

		// sent from the underlying websocket to any connected users
		incomingMessagesChan = make(chan rpcBody)

		// sent down when the connection needs to close prematurely
		closeChannel = make(chan bool)

		// all messages with their reply queue are stored in this map
		// to connect the response to it

		responses = make(map[int]chan websocketOutgoingResponse, 0)
	)

	callIdCount := 0

	conn, _, err := websocket.DefaultDialer.Dial(url, nil)

	if err != nil {
		return nil, fmt.Errorf(
			"error dialling the solana websocket: %w",
			err,
		)
	}

	go func() {
		for {
			var response rpcBody

			if err := conn.ReadJSON(&response); err != nil {
				log.Fatal(func(k *log.Log) {
					k.Context = LogContextWebsocket
					k.Message = "Failed to decode a message from Solana websocket!"
					k.Payload = err
				})
			}

			// send to the internal server to relay

			incomingMessagesChan <- response
		}
	}()

	go func() {
		for {
			select {
			case response := <-incomingMessagesChan:
				id := response.Id

				responses, ok := responses[id]

				if !ok {
					log.App(func(k *log.Log) {
						k.Context = LogContextWebsocket

						k.Format(
							"Got a message for id %v that was previously said to have shutdown",
							id,
						)
					})
				}

				responses <- websocketOutgoingResponse{
					id:     id,
					method: response.Method,
					params: response.Params,
					err:    response.Err,
				}

			case rpcCall := <-outgoingMessagesChan:
				var (
					method        = rpcCall.method
					returnChannel = rpcCall.returnChannel
				)

				callId := callIdCount

				callIdCount += 1

				params, err := json.Marshal(rpcCall.params)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Context = LogContextWebsocket
						k.Message = "Failed to encode the params for the Solana socket!"
						k.Payload = err
					})
				}

				rpcBody := rpcBody{
					Id:      callId,
					JsonRpc: "2.0",
					Method:  method,
					Params:  params,
				}

				err = conn.WriteJSON(rpcBody)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Context = LogContextWebsocket

						k.Format(
							"Failed to write the rpc body to the Solana socket %v!",
							rpcBody,
						)

						k.Payload = err
					})
				}

				// remember the request so we can send them the response later

				responses[callId] = returnChannel
			}
		}
	}()

	websocket := Websocket{
		invokeChan:  outgoingMessagesChan,
		shouldClose: closeChannel,
	}

	return &websocket, nil
}

func (websocket Websocket) subscribe(method string, params interface{}) (ticket websocketOutgoingResponse, replies chan websocketOutgoingResponse) {
	replies = make(chan websocketOutgoingResponse)

	websocket.invokeChan <- websocketOutgoing{
		method: method,
		params: params,
	}

	ticket = <-replies

	return ticket, replies
}

func (websocket Websocket) RawInvoke(method string, params interface{}) (json.RawMessage, error) {
	ticket, replies := websocket.subscribe(method, params)

	response := <-replies

	response.cleanup <- ticket.id

	params_ := response.params

	if err := response.err; err != nil {
		return params_, fmt.Errorf(
			"rpc method %v returned error: %v",
			method,
			err,
		)
	}

	return params_, nil
}
