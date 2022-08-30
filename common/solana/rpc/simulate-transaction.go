package rpc

import (
	"encoding/base64"
	"encoding/json"
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/solana"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
)

type SimulationResponse struct {
	TransactionError interface{}     `json:"err"`
	Logs             []string        `json:"logs"`
	Accounts         []types.Account `json:"accounts"`
	UnitsConsumed    uint64          `json:"unitsConsumed"`
}

func (s Provider) SimulateTransaction(transaction []byte, signatureVerify bool, commitment string, replaceRecentBlockHash bool, accounts ...solana.PublicKey) (*SimulationResponse, error) {
	transactionBase64 := base64.StdEncoding.EncodeToString(
		transaction,
	)

	accountsStrings := make([]string, len(accounts))

	for i, value := range accounts {
		accountsStrings[i] = value.ToBase58()
	}

	options := map[string]interface{}{
		"sigVerify":              signatureVerify,
		"commitment":             "finalized",
		"encoding":               "base64",
		"replaceRecentBlockHash": true,
		"accounts": map[string]interface{}{
			"encoding":  "base64",
			"addresses": accountsStrings,
		},
	}

	params := []interface{}{
		transactionBase64,
		options,
	}

	res, err := s.RawInvoke("simulateTransaction", params)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to getAccountInfo: %v",
			err,
		)
	}

	var simulationResponse SimulationResponse

	if err := json.Unmarshal(res, &simulationResponse); err != nil {
		return nil, fmt.Errorf(
			"failed to decode getAccountInfo, message %#v: %v",
			string(res),
			err,
		)
	}

	return &simulationResponse, nil
}
