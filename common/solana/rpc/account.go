package rpc

import "github.com/fluidity-money/fluidity-app/common/solana"

type Account struct {
	// Number of lamports assigned to this account
	Lamports uint64 `json:"lamports"`

	// Pubkey of the program this account has been assigned to
	Owner solana.PublicKey `json:"owner"`

	// Boolean indicating if the account contains a program (and is strictly read-only)
	Executable bool `json:"executable"`

	// The epoch at which this account will next owe rent
	RentEpoch uint64 `json:"rentEpoch"`
}
