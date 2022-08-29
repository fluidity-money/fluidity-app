package rpc

import (
	"encoding/json"
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/solana"
)

type GetAccountInfoResult struct {
	RpcContext
	Value *Account `json:"value"`
}

func (s RpcProvider) GetAccountInfo(account solana.PublicKey) (*GetAccountInfoResult, error) {
	res, err := s.RawInvoke("getAccountInfo", account)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to getAccountInfo: %v",
			err,
		)
	}

	var accountInfoResult GetAccountInfoResult

	if err := json.Unmarshal(res, &accountInfoResult); err != nil {
		return nil, fmt.Errorf(
			"failed to decode getAccountInfo, message %#v: %v",
			string(res),
			err,
		)
	}

	return &accountInfoResult, nil
}
