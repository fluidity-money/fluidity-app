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
		id     int
		result json.RawMessage
		err    *rpcError
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
		incomingMessagesChan = make(chan rpcResponse)

		// sent down when the connection needs to close prematurely
		closeChannel = make(chan bool)

		// all messages with their reply queue are stored in this map
		// to connect the response to it

		responses = make(map[int]chan websocketOutgoingResponse, 0)
	)

	conn, _, err := websocket.DefaultDialer.Dial(url, nil)

	if err != nil {
		return nil, fmt.Errorf(
			"error dialling the solana websocket: %w",
			err,
		)
	}

	go func() {
	L:
		for {
			var response rpcResponse

			messageType, message, err := conn.ReadMessage()

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Context = LogContextWebsocket
					k.Message = "Failed to read a message from the Solana websocket!"
					k.Payload = err
				})
			}

			switch messageType {
			case websocket.TextMessage:

			case websocket.BinaryMessage:
				log.Fatal(func(k *log.Log) {
					k.Context = LogContextWebsocket
					k.Message = "Received binary message from the websocket!"
				})

			case websocket.CloseMessage:
				log.Fatal(func(k *log.Log) {
					k.Context = LogContextWebsocket
					k.Message = "Received a close message from the websocket!"
				})

			default:
				continue L
			}

			err = json.Unmarshal(message, &response)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Context = LogContextWebsocket

					k.Format(
						"Failed to decode message (%#v) off the websocket!",
						string(message),
					)
				})
			}

			log.Debug(func(k *log.Log) {
				k.Context = LogContextWebsocket

				k.Format(
					"Received the message for caller id %v, %#v",
					response.Id,
					string(message),
				)
			})

			// send to the internal server to relay

			incomingMessagesChan <- response
		}
	}()

	callIdCount := 0

	go func() {
		for {
			select {
			case response := <-incomingMessagesChan:
				id := response.Id

				responses, ok := responses[id]

				if !ok {
					log.Fatal(func(k *log.Log) {
						k.Context = LogContextWebsocket

						k.Format(
							"Got a message for id %v that does not exist!",
							id,
						)
					})
				}

				log.Debug(func(k *log.Log) {
					k.Context = LogContextWebsocket

					k.Format(
						"Sending a message to caller %v!",
						id,
					)
				})

				responses <- websocketOutgoingResponse{
					id:     id,
					result: response.Result,
					err:    response.Err,
				}

				log.Debug(func(k *log.Log) {
					k.Context = LogContextWebsocket

					k.Format(
						"Done sending a message to caller id %v!",
						id,
					)
				})

			case rpcCall := <-outgoingMessagesChan:
				var (
					method        = rpcCall.method
					params        = rpcCall.params
					returnChannel = rpcCall.returnChannel
				)

				callId := callIdCount

				callIdCount += 1

				rpcRequest := rpcRequest{
					Id:      callId,
					JsonRpc: "2.0",
					Method:  method,
					Params:  params,
				}

				bytes, err := json.Marshal(rpcRequest)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Context = LogContextWebsocket
						k.Message = "Failed to encode a RPC request for sending down Solana socket"
						k.Payload = err
					})
				}

				err = conn.WriteMessage(websocket.TextMessage, bytes)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Context = LogContextWebsocket

						k.Format(
							"Failed to write the rpc body to the Solana socket %v!",
							rpcRequest,
						)

						k.Payload = err
					})
				}

				log.Debug(func(k *log.Log) {
					k.Context = LogContextWebsocket

					k.Format(
						"Sent the message %#v, assigning the caller id %v",
						string(bytes),
						callId,
					)
				})

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

func (websocket Websocket) subscribe(method string, params interface{}) chan websocketOutgoingResponse {
	replies := make(chan websocketOutgoingResponse)

	websocket.invokeChan <- websocketOutgoing{
		method:        method,
		params:        params,
		returnChannel: replies,
	}

	return replies
}

func (websocket Websocket) RawInvoke(method string, params interface{}) (json.RawMessage, error) {
	replies := websocket.subscribe(method, params)

	response := <-replies

	result := response.result

	if err := response.err; err != nil {
		return result, fmt.Errorf(
			"rpc method %v returned error: %v",
			method,
			err,
		)
	}

	return result, nil
}
