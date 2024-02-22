package sui

import (
	"encoding/json"
	"math/big"
	"strconv"
	"time"
)

type WrapEvent struct {
	CoinReserveId string `json:"coin_reserve_id"`
	// FCoinAmount is the amount of fluid coin out
	FCoinAmount *big.Int `json:"f_coin_amount"`
	GlobalId    string   `json:"global_id"`
	SCoinAmount *big.Int `json:"s_coin_amount"`
	Time        int64    `json:"time"`
	// UnderlyingAmount is the amount wrapped
	UnderlyingAmount *big.Int `json:"underlying_amount"`
	UserAddress      string   `json:"user_address"`
	UserVaultId      string   `json:"user_vault_id"`
}

type rawWrapEvent struct {
	CoinReserveId string `json:"coin_reserve_id"`
	// FCoinAmount is the amount of fluid coin out
	FCoinAmount string `json:"f_coin_amount"`
	GlobalId    string `json:"global_id"`
	SCoinAmount string `json:"s_coin_amount"`
	Time        string `json:"time"`
	// UnderlyingAmount is the amount wrapped
	UnderlyingAmount string `json:"underlying_amount"`
	UserAddress      string `json:"user_address"`
	UserVaultId      string `json:"user_vault_id"`
}

type UnwrapEvent struct {
	CoinReserveId string `json:"coin_reserve_id"`
	// FCoinAmount is the amount of fluid coin out
	FCoinAmount *big.Int `json:"f_coin_amount"`
	FCoinId     string   `json:"f_coin_id"`
	GlobalId    string   `json:"global_id"`
	Time        int64    `json:"time"`
	// UnderlyingAmount is the amount wrapped
	UnderlyingAmount     *big.Int `json:"underlying_amount"`
	UserAddress          string   `json:"user_address"`
	UserVaultId          string   `json:"user_vault_id"`
	PrizePoolVaultId     string   `json:"prize_pool_vault_id"`
	PrizePoolVaultAmount *big.Int `json:"prize_pool_vault_amount"`
}

type rawUnwrapEvent struct {
	CoinReserveId string `json:"coin_reserve_id"`
	// FCoinAmount is the amount of fluid coin out
	FCoinAmount string `json:"f_coin_amount"`
	FCoinId     string `json:"f_coin_id"`
	GlobalId    string `json:"global_id"`
	Time        string `json:"time"`
	// UnderlyingAmount is the amount wrapped
	UnderlyingAmount     string `json:"underlying_amount"`
	UserAddress          string `json:"user_address"`
	UserVaultId          string `json:"user_vault_id"`
	PrizePoolVaultId     string `json:"prize_pool_vault_id"`
	PrizePoolVaultAmount string `json:"prize_pool_vault_amount"`
}

type DistributeYieldEvent struct {
	PrizePoolVaultId  string `json:"prize_pool_vault_id"`
	AmountDistributed uint64 `json:"amount_distributed"`
	Recipient         string `json:"recipient"`
}

func (r *rawWrapEvent) WrapEvent() (WrapEvent, error) {
	fCoinAmount, _ := new(big.Int).SetString(r.FCoinAmount, 10)
	sCoinAmount, _ := new(big.Int).SetString(r.SCoinAmount, 10)
	underlyingAmount, _ := new(big.Int).SetString(r.UnderlyingAmount, 10)

	time, err := strconv.ParseInt(r.Time, 10, 64)
	if err != nil {
		return WrapEvent{}, err
	}

	return WrapEvent{
		CoinReserveId:    r.CoinReserveId,
		FCoinAmount:      fCoinAmount,
		GlobalId:         r.GlobalId,
		SCoinAmount:      sCoinAmount,
		Time:             time,
		UnderlyingAmount: underlyingAmount,
		UserAddress:      r.UserAddress,
		UserVaultId:      r.UserVaultId,
	}, nil
}

func (r *rawUnwrapEvent) UnwrapEvent() (UnwrapEvent, error) {
	fCoinAmount, _ := new(big.Int).SetString(r.FCoinAmount, 10)
	prizePoolAmount, _ := new(big.Int).SetString(r.PrizePoolVaultAmount, 10)
	underlyingAmount, _ := new(big.Int).SetString(r.UnderlyingAmount, 10)

	time, err := strconv.ParseInt(r.Time, 10, 64)
	if err != nil {
		return UnwrapEvent{}, err
	}

	return UnwrapEvent{
		CoinReserveId:        r.CoinReserveId,
		FCoinAmount:          fCoinAmount,
		GlobalId:             r.GlobalId,
		PrizePoolVaultId:     r.PrizePoolVaultId,
		PrizePoolVaultAmount: prizePoolAmount,
		Time:                 time,
		UnderlyingAmount:     underlyingAmount,
		UserAddress:          r.UserAddress,
		UserVaultId:          r.UserVaultId,
	}, nil
}

func ParseWrap(parsedJson map[string]interface{}) (WrapEvent, error) {
	var w rawWrapEvent

	s, err := json.Marshal(parsedJson)
	if err != nil {
		return WrapEvent{}, err
	}

	if err := json.Unmarshal([]byte(s), &w); err != nil {
		return WrapEvent{}, err
	}

	wrapEvent, err := w.WrapEvent()
	if err != nil {
		return WrapEvent{}, err
	}

	return wrapEvent, nil
}

func ParseUnwrap(parsedJson map[string]interface{}) (UnwrapEvent, error) {
	var w rawUnwrapEvent

	s, err := json.Marshal(parsedJson)
	if err != nil {
		return UnwrapEvent{}, err
	}

	if err := json.Unmarshal([]byte(s), &w); err != nil {
		return UnwrapEvent{}, err
	}

	unwrapEvent, err := w.UnwrapEvent()
	if err != nil {
		return UnwrapEvent{}, err
	}

	return unwrapEvent, nil
}

func ParseDistributeYield(parsedJson map[string]interface{}) (DistributeYieldEvent, error) {
	var w DistributeYieldEvent

	s, err := json.Marshal(parsedJson)
	if err != nil {
		return DistributeYieldEvent{}, err
	}

	if err := json.Unmarshal([]byte(s), &w); err != nil {
		return DistributeYieldEvent{}, err
	}

	return w, nil
}

// Checkpoint is an internal, simplified representation of a checkpoint to be processed by user actions
type Checkpoint struct {
	// block num
	SequenceNumber string    `json:"sequence_number"`
	Timestamp      time.Time `json:"timestamp"`
	// digest of included txs
	Transactions []string `json:"transactions"`
}

type Transfer struct {
	Token            SuiToken  `json:"token"`
	Timestamp        time.Time `json:"timestamp"`
	SenderAddress    string    `json:"sender_address"`
	RecipientAddress string    `json:"recipient_address"`
	Amount           *big.Int  `json:"amount"`
}

type SuiEvent struct {
	Wrap            WrapEvent            `json:"wrap,omitempty"`
	Unwrap          UnwrapEvent          `json:"unwrap,omitempty"`
	DistributeYield DistributeYieldEvent `json:"distribute_yield,omitempty"`
}
