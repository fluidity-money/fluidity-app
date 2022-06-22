package solana

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

type (
	SolanaRpcBody struct {
		JsonRpc string      `json:"jsonrpc"`
		Method  string      `json:"method"`
		Params  interface{} `json:"params"`
		Id      string      `json:"id"`
	}

	AccountSubscribeParams [2]interface{}

	AccountSubscribeParamsFilters struct {
		Encoding   string `json:"encoding"`
		Commitment string `json:"commitment"`
	}

	SubscriptionResponse struct {
		Jsonrpc string `json:"jsonrpc"`
		Result  int    `json:"result,omitempty"`
		Id      int    `json:"method"`
		Error   struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		} `json:"error"`
	}

	AccountSubscribeResponse struct {
		Jsonrpc string `json:"jsonrpc"`
		Method  string `json:"method"`
		Params  struct {
			Result       AccountNotification `json:"result"`
			Subscription int                 `json:"subscription"`
		} `json:"params"`
	}

	AccountNotification struct {
		Context struct {
			Slot int `json:"slot"`
		} `json:"context"`
		Value struct {
			Data       [2]string `json:"data"`
			Executable bool      `json:"executable"`
			Lamports   int       `json:"lamports"`
			Owner      string    `json:"owner"`
			RentEpoch  int       `json:"rentEpoch"`
		} `json:"value"`
	}
)

type Subscription struct {
	requestCloseChan chan struct{}
}

// SubscribeAccount subscribes to changes to acounts
func SubscribeAccount(url, programId string, messageChan chan AccountNotification, errChan chan error) (*Subscription, error) {
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

		accountSubscriptionParams := AccountSubscribeParams{
			programId,
			AccountSubscribeParamsFilters{
				Encoding:   "base64",
				Commitment: "finalized",
			},
		}

		accountSubscriptionBody := SolanaRpcBody{
			JsonRpc: "2.0",
			Id:      "1",
			Method:  "accountSubscribe",
			Params:  accountSubscriptionParams,
		}

		// subscribe to the events
		_, err := subscribe(accountSubscriptionBody, conn)

		if err != nil {
			errChan <- fmt.Errorf("Failed to subscribe to solana data acc: %w", err)
			return
		}

		// read messages into a channel, close the websocket to stop this
		go func() {
			defer close(socketClosedChan)

			for {
				_, msg, err := conn.ReadMessage()

				if err != nil {
					rawErrChan <- fmt.Errorf("Error reading from the solana websocket: %w", err)
					return
				}

				rawMessageChan <- msg
			}
		}()

		for {
			select {
			case m := <-rawMessageChan:

				// decode the message

				var res AccountSubscribeResponse

				if err := json.Unmarshal(m, &res); err != nil {
					errChan <- fmt.Errorf("Error parsing a solana websocket message: %w", err)
					return
				}

				messageChan <- res.Params.Result

			case e := <-rawErrChan:
				errChan <- e
				return

			case <-requestCloseChan:
				err := conn.WriteMessage(
					websocket.CloseMessage,
					websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""),
				)

				if err != nil {
					errChan <- fmt.Errorf("Error requesting websocket close: %w", err)
					return
				}

				// wait for the socket to close
				select {
				case <-socketClosedChan:
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

	var subscriptionRes SubscriptionResponse

	if err := conn.ReadJSON(&subscriptionRes); err != nil {
		return 0, fmt.Errorf("Error reading subscription response: %w", err)
	}

	if subscriptionRes.Error.Message != "" {
		err := fmt.Errorf("Error subscribing to solana logs: %s", subscriptionRes.Error.Message)
		return 0, err
	}

	return subscriptionRes.Id, nil
}

// Close closes a solana websocket subscription
func (s Subscription) Close() {
	s.requestCloseChan <- struct{}{}
}
