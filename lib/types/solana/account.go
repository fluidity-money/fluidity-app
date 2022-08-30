package solana

import (
	"encoding/base64"
	"fmt"
)

type Account struct {
	// Number of lamports assigned to this account
	Lamports uint64 `json:"lamports"`

	// Pubkey of the program this account has been assigned to
	Owner string `json:"owner"`

	// Data associated with the account, hardstuck in its binary form
	Data []string `json:"data"`

	// Boolean indicating if the account contains a program (and is strictly read-only)
	Executable bool `json:"executable"`

	// The epoch at which this account will next owe rent
	RentEpoch uint64 `json:"rentEpoch"`
}

// GetBinary by decoding the second item in the data field for the account
func (account Account) GetBinary() ([]byte, error) {
	if accountDataLen := len(account.Data); accountDataLen != 2 {
		return nil, fmt.Errorf(
			"account data didn't include the right amount of fields, expected 2, was %d",
			accountDataLen,
		)
	}

	var (
		accountData    = account.Data[0]
		encodingFormat = account.Data[1]
	)

	if encodingFormat != "base64" {
		return nil, fmt.Errorf(
			"failed to decode a message not of encoding base64, was %v",
			encodingFormat,
		)
	}

	bytes, err := base64.StdEncoding.DecodeString(accountData)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to decode the account data from base64: %v",
			err,
		)
	}

	return bytes, nil
}
