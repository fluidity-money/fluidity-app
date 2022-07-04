package solana

// solana contains the types that we use for tracking Solana on-chain
// state

import (
	"math/big"

	user_actions "github.com/fluidity-money/fluidity-app/lib/types/user-actions"
)

type (
	// SubscriptionResponse is the confirmation or rejection of a subscription on
	// the Solana websocket
	SubscriptionResponse struct {
		Result int               `json:"result"`
		Id     int               `json:"id"`
		Error  SubscriptionError `json:"error"`
	}

	SubscriptionError struct {
		Message string `json:"message"`
	}
)

type (
	// BufferedTransactionsLogs created by microservice-solana-buffer-logs,
	// including the slot (block number) that could be useful for calculating
	// the number of fluid transfers in a block
	BufferedTransactionLog struct {
		Slot                 uint64           `json:"slot"`
		Logs                 []TransactionLog `json:"logs"`
		SecondsSinceLastSlot uint64           `json:"seconds_since_last_slot"`
	}

	// BufferedTransactions that were seen together in the same slot
	BufferedTransaction struct {
		Slot         uint64        `json:"slot"`
		Transactions []Transaction `json:"transactions"`

		// LogsCount of the number of logs previously sent in the buffered logs
		LogsCount            int    `json:"logs_count"`
		SecondsSinceLastSlot uint64 `json:"seconds_since_last_slot"`
	}

	BufferedUserActions struct {
		Slot                 uint64                    `json:"slot"`
		UserActions          []user_actions.UserAction `json:"user_actions"`
		LogCount             int                       `json:"logs_count"`
		SecondsSinceLastSlot uint64                    `json:"seconds_since_last_slot"`
	}
)

type (
	// TransactionLog is a simplified version of the transaction log type
	// returned from Solana websocket subscriptions
	TransactionLog struct {
		Params params `json:"params"`
	}

	params struct {
		Result result `json:"result"`
	}

	result struct {
		Value   value   `json:"value"`
		Context context `json:"context"`
	}

	value struct {
		Signature string   `json:"signature"`
		Logs      []string `json:"logs"`
	}

	context struct {
		Slot uint64 `json:"slot"`
	}
)

type (
	// Transaction is part of the transaction info type
	// returned from the Solana RPC call
	Transaction struct {
		// this property doesn't actually exist on the solana RPC type,
		//  but we add it here for convenience
		Signature   string            `json:"signature"`
		Result      TransactionResult `json:"result"`
		AdjustedFee *big.Rat          `json:"adjustedFee"`
		SaberFee    *big.Rat          `json:"saberFee"`
	}

	TransactionResult struct {
		Meta        TransactionMeta     `json:"meta"`
		Slot        int                 `json:"slot"`
		Transaction TransactionInnerTxn `json:"transaction"`
	}

	TransactionMeta struct {
		// TODO solana doesn't doccument what this type actually is
		Err               interface{}               `json:"err"`
		Fee               uint64                    `json:"fee"`
		PreTokenBalances  []TransactionTokenBalance `json:"preTokenBalances"`
		PostTokenBalances []TransactionTokenBalance `json:"postTokenBalances"`
		InnerInstructions []TransactionInstruction  `json:"innerInstructions"`
		Logs              []string                  `json:"logMessages"`
	}

	TransactionTokenBalance struct {
		AccountIndex  int                    `json:"accountIndex"`
		Mint          string                 `json:"mint"`
		Owner         string                 `json:"owner"`
		UiTokenAmount TransactionTokenAmount `json:"uiTokenAmount"`
	}

	TransactionTokenAmount struct {
		Amount         string `json:"amount"`
		Decimals       int    `json:"decimals"`
		UiAmountString string `json:"uiAmountString"`
	}

	TransactionInnerTxn struct {
		Message    TransactionMessage `json:"message"`
		Signatures []string           `json:"signatures"`
	}

	TransactionMessage struct {
		AccountKeys  []string                 `json:"accountKeys"`
		Instructions []TransactionInstruction `json:"instructions"`
	}

	TransactionInstruction struct {
		Accounts       []int  `json:"accounts"`
		Data           string `json:"data"`
		ProgramIdIndex int    `json:"programIdIndex"`
	}
)

// Slot is the type that logs the current slot as sent by the solana RPC
type Slot struct {
	Slot uint64 `json:"slot"`
}
