// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package solana

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
	"github.com/gorilla/websocket"
)

type Subscription struct {
	requestCloseChan chan struct{}
}

// rpcResponse is a container to hold generic json responses
type rpcResponse struct {
	Result json.RawMessage        `json:"result"`
	Error  map[string]interface{} `json:"error"`
}

type (
	// slotRpc is the type returned for slot subscriptions by the solana RPC
	slotRpc struct {
		Params slotParams `json:"params"`
	}
	slotParams struct {
		Result types.Slot `json:"result"`
	}
)

var commitmentFinalizedParam = map[string]interface{}{
	"commitment": "finalized",
}

var slotsSubscriptionMessage = map[string]interface{}{
	"jsonrpc": "2.0",
	"id":      1,
	"method":  "slotSubscribe",
}

var (
	getSlotMethod = "getSlot"
	getSlotParams = []interface{}{commitmentFinalizedParam}
)

type getSlotResult = uint64

const getBlocksWithLimitMethod = "getBlocksWithLimit"

func getBlocksWithLimitParams(from, pageLength uint64) []interface{} {
	return []interface{}{from, pageLength, commitmentFinalizedParam}
}

type getBlocksResult = []uint64

// SubscribeSlots subscribes to Solana slot notifications
func SubscribeSlots(url string, messageChan chan types.Slot, errChan chan error) (*Subscription, error) {
	conn, _, err := websocket.DefaultDialer.Dial(url, nil)

	if err != nil {
		return nil, fmt.Errorf("Error dialling the solana websocket: %w", err)
	}

	// user requested close
	requestCloseChan := make(chan struct{})

	go func() {
		// read logs
		var (
			rawMessageChan   = make(chan []byte)
			rawErrChan       = make(chan error)
			socketClosedChan = make(chan struct{})
		)

		defer conn.Close()

		// subscribe to the events
		_, err := subscribe(slotsSubscriptionMessage, conn)

		if err != nil {
			errChan <- fmt.Errorf("Failed to subscribe to solana logs: %w", err)
			return
		}

		// read messages into a channel, close the websocket to stop this
		go func() {
			defer close(socketClosedChan)

			for {
				_, msg, err := conn.ReadMessage()

				if err != nil {
					rawErrChan <- fmt.Errorf(
						"Error reading from the solana websocket: %w",
						err,
					)

					return
				}

				rawMessageChan <- msg
			}
		}()

		for {
			select {
			case m := <-rawMessageChan:

				// decode the message

				var log slotRpc

				if err := json.Unmarshal(m, &log); err != nil {
					errChan <- fmt.Errorf(
						"Error parsing a solana websocket message: %w",
						err,
					)

					return
				}

				messageChan <- log.Params.Result

			case e := <-rawErrChan:
				errChan <- e
				return

			case <-requestCloseChan:
				formattedMessageClose := websocket.FormatCloseMessage(
					websocket.CloseNormalClosure,
					"",
				)

				err := conn.WriteMessage(
					websocket.CloseMessage,
					formattedMessageClose,
				)

				if err != nil {
					errChan <- fmt.Errorf(
						"Error requesting websocket close: %w",
						err,
					)

					return
				}

				// wait for the socket to close or timeout
				select {
				case <-socketClosedChan:
				case <-time.After(time.Second):
				}

				return
			}
		}
	}()

	sub := Subscription{
		requestCloseChan: requestCloseChan,
	}

	return &sub, nil
}

// send a subscription message and wait for the response
// this reads from the websocket, you must call this before
// reading from it elsewhere
func subscribe(message interface{}, conn *websocket.Conn) (int, error) {
	messageBytes, err := json.Marshal(message)

	if err != nil {
		return 0, fmt.Errorf("Failed to serialize message to JSON: %w", err)
	}

	err = conn.WriteMessage(websocket.TextMessage, messageBytes)

	if err != nil {
		return 0, fmt.Errorf("Error sending subscription message: %w", err)
	}

	var subscriptionRes types.SubscriptionResponse

	if err := conn.ReadJSON(&subscriptionRes); err != nil {
		return 0, fmt.Errorf("Error reading subscription response: %w", err)
	}

	if subscriptionRes.Error.Message != "" {
		err := fmt.Errorf(
			"Error subscribing to solana logs: %s",
			subscriptionRes.Error.Message,
		)

		return 0, err
	}

	return subscriptionRes.Id, nil
}

// Close closes a solana websocket subscription
func (s Subscription) Close() {
	s.requestCloseChan <- struct{}{}
}

func rpcCall(rpcUrl, method string, params []interface{}, res interface{}) error {
	requestBuf := new(bytes.Buffer)
	encoder := json.NewEncoder(requestBuf)

	message := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  method,
		"params":  params,
	}

	err := encoder.Encode(message)

	if err != nil {
		return fmt.Errorf("Failed to encode RPC call: %w", err)
	}

	r, err := http.Post(
		rpcUrl,
		"application/json",
		requestBuf,
	)

	if err != nil {
		return fmt.Errorf("Failed to make an RPC call: %w", err)
	}

	defer r.Body.Close()

	reader := json.NewDecoder(r.Body)

	var decodedResponse rpcResponse

	if err := reader.Decode(&decodedResponse); err != nil {
		return fmt.Errorf("Failed decoding RPC response: %w", err)
	}

	if decodedResponse.Error != nil {
		return fmt.Errorf("RPC request error: %v", decodedResponse.Error)
	}

	return json.Unmarshal(decodedResponse.Result, res)
}

func GetConfirmedBlocks(rpcUrl string, from, pageLength uint64) ([]uint64, error) {
	var res getBlocksResult

	err := rpcCall(
		rpcUrl,
		getBlocksWithLimitMethod,
		getBlocksWithLimitParams(from, pageLength),
		&res,
	)

	if err != nil {
		return nil, err
	}

	return res, nil
}

func GetLatestSlot(rpcUrl string) (uint64, error) {
	var res getSlotResult

	err := rpcCall(rpcUrl, getSlotMethod, getSlotParams, &res)

	if err != nil {
		return 0, err
	}

	return res, nil
}
