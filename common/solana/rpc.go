package solana

import (
	"encoding/base64"
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

type SolanaPartialRpcBody struct {
	JsonRpc string          `json:"jsonrpc"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params"`
	Id      string          `json:"id"`
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

type RPCClient struct {
	conn         *websocket.Conn
	invokeChan   chan SolanaRpcBody
	errChan      chan error
	responseChan chan interface{}
}

func MakeRPCClient(url string, invokeChan chan SolanaRpcBody, errChan chan error) *RPCClient {
	conn, _, err := websocket.DefaultDialer.Dial(url, nil)

	if err != nil {
		errChan <- fmt.Errorf("error dialling the solana websocket: %w", err)
	}

	return &RPCClient{
		conn:         conn,
		invokeChan:   invokeChan,
		errChan:      errChan,
		responseChan: make(chan interface{}),
	}
}

type RPCReturnChannel struct {
	returnChannel chan json.RawMessage
	method        string
	body          interface{}
}

type SolanaRPCHandle struct {
	shouldClose   chan bool
	invokeChannel chan RPCReturnChannel
	_conn         AbstractSocket
}

func (s *SolanaRPCHandle) Close() {
	s.shouldClose <- true
}

// Abstract shim for mocking request and response
type AbstractSocket interface {
	Read(interface{}) error
	Write(interface{}) error
	Close()
}

// Implements abstract socket
type RPCSocket struct {
	conn *websocket.Conn
}

func (r *RPCSocket) Read(v interface{}) error {
	return r.conn.ReadJSON(v)
}

func (r *RPCSocket) Write(v interface{}) error {
	return r.conn.WriteJSON(v)
}

func (r *RPCSocket) Close() {
	r.conn.Close()
}

func SolanaCallManager(url string) (*SolanaRPCHandle, error) {
	id := 0
	closeChannel := make(chan bool)
	rpcChan := make(chan RPCReturnChannel)

	conn, _, err := websocket.DefaultDialer.Dial(url, nil)

	rpcSocket := RPCSocket{
		conn,
	}

	if err != nil {
		return nil, fmt.Errorf("error dialling the solana websocket: %w", err)
	}

	// Anonymous goroutine
	go func() {
	loop:
		for {
			select {
			case <-closeChannel:
				break loop
			case rpcCall := <-rpcChan:
				callId := id
				id += 1
				params, _ := json.Marshal(rpcCall.body)
				rpcSocket.Write(&SolanaPartialRpcBody{
					Id:      fmt.Sprintf("%d", callId),
					JsonRpc: "2",
					Method:  rpcCall.method,
					Params:  params,
				})

				response := SolanaPartialRpcBody{}
				rpcSocket.Read(&response)

				rpcCall.returnChannel <- response.Params
			}
		}

		rpcSocket.Close()
	}()
	return &SolanaRPCHandle{
		shouldClose:   closeChannel,
		invokeChannel: rpcChan,
		_conn:         &rpcSocket,
	}, nil
}

// Invoke Solana RPC method
func (s *SolanaRPCHandle) RawInvoke(method string, body interface{}) json.RawMessage {
	returnChannel := make(chan json.RawMessage)

	s.invokeChannel <- RPCReturnChannel{
		returnChannel: returnChannel,
		body:          body,
		method:        method,
	}

	return <-returnChannel
}

type Context struct {
	Slot uint64 `json:"slot"`
}

type RPCContext struct {
	Context Context `json:"context,omitempty"`
}

type Account struct {
	// Number of lamports assigned to this account
	Lamports uint64 `json:"lamports"`

	// Pubkey of the program this account has been assigned to
	Owner PublicKey `json:"owner"`

	// Data associated with the account, either as encoded binary data or JSON format {<program>: <state>}, depending on encoding parameter
	Data *DataBytesOrJSON `json:"data"`

	// Boolean indicating if the account contains a program (and is strictly read-only)
	Executable bool `json:"executable"`

	// The epoch at which this account will next owe rent
	RentEpoch uint64 `json:"rentEpoch"`
}

type EncodingType string

type Data struct {
	Content  []byte
	Encoding EncodingType
}

type DataBytesOrJSON struct {
	rawDataEncoding EncodingType
	asDecodedBinary Data
	asJSON          json.RawMessage
}

type GetAccountInfoResult struct {
	RPCContext
	Value *Account `json:"value"`
}

type DataSlice struct {
	Offset *uint64 `json:"offset,omitempty"`
	Length *uint64 `json:"length,omitempty"`
}

type GetAccountInfoOpts struct {
	Encoding   EncodingType
	Commitment string
	DataSlice  *DataSlice
}

var ErrNotFound = fmt.Errorf("not found")

func (s *SolanaRPCHandle) GetAccountInfo(account PublicKey) (*GetAccountInfoResult, error) {
	var res *GetAccountInfoResult
	err := json.Unmarshal([]byte(s.RawInvoke("getAccountInfo", account)), res)
	if err != nil {
		return nil, ErrNotFound
	}
	return res, nil
}

type M map[string]interface{}

type BlockhashResult struct {
	Blockhash     Hash          `json:"blockhash"`
	FeeCalculator FeeCalculator `json:"feeCalculator"`
}

type FeeCalculator struct {
	LamportsPerSignature uint64 `json:"lamportsPerSignature"`
}

type GetRecentBlockhashResult struct {
	RPCContext
	Value *BlockhashResult `json:"value"`
}

func (s *SolanaRPCHandle) GetRecentBlockhash(commitment string) (*GetRecentBlockhashResult, error) {
	params := []interface{}{}
	if commitment != "" {
		params = append(params, M{"commitment": commitment})
	}
	var res *GetRecentBlockhashResult
	err := json.Unmarshal([]byte(s.RawInvoke("getRecentBlockhash", params)), res)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (s *SolanaRPCHandle) SendTransaction(transaction *Transaction) (signature Signature, err error) {
	txData, err := transaction.MarshalBinary()
	if err != nil {
		return Signature{}, fmt.Errorf("send transaction: encode transaction: %w", err)
	}

	obj := M{
		"encoding": "base64",
	}

	params := []interface{}{
		base64.StdEncoding.EncodeToString(txData),
		obj,
	}

	var sig *Signature
	err = json.Unmarshal(s.RawInvoke("sendTransaction", params), sig)
	if err != nil {
		return Signature{}, err
	}

	return *sig, nil
}

type UiTokenAmount struct {
	// Raw amount of tokens as a string, ignoring decimals.
	Amount string `json:"amount"`

	// TODO: <number> == int64 ???
	// Number of decimals configured for token's mint.
	Decimals uint8 `json:"decimals"`

	// DEPRECATED: Token amount as a float, accounting for decimals.
	UiAmount *float64 `json:"uiAmount"`

	// Token amount as a string, accounting for decimals.
	UiAmountString string `json:"uiAmountString"`
}

type GetTokenSupplyResult struct {
	RPCContext
	Value *UiTokenAmount `json:"value"`
}

func (s *SolanaRPCHandle) GetTokenSupply(mint PublicKey, commitment string) (*GetTokenSupplyResult, error) {
	params := []interface{}{}
	if commitment != "" {
		params = append(params, M{"commitment": commitment})
	}
	var res *GetTokenSupplyResult
	err := json.Unmarshal([]byte(s.RawInvoke("getTokenSupply", params)), res)
	if err != nil {
		return nil, err
	}
	return res, nil
}
