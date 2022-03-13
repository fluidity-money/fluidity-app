package solana

import (
	"math/big"
	"strconv"
	"strings"

	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
)

const (
	DefaultSolanaComputeBudget = 200_000
	DefaultSolanaComputeUsed   = 1_000
)

// Get amount of compute budget used by transaction
func GetComputeUsed(txn types.TransactionResult) *big.Rat {
	logs := txn.Meta.Logs

	numLogs := len(logs)

	computeUsed := big.NewRat(DefaultSolanaComputeUsed, DefaultSolanaComputeBudget)

	if numLogs < 2 {
		return computeUsed
	}

	logString := logs[numLogs-2]
	words := strings.Split(logString, " ")

	if len(words) < 4 {
		return computeUsed
	}

	if words[2] != "consumed" {
		return computeUsed
	}

	usedString := words[3]
	budgetString := words[5]

	used, err := strconv.ParseInt(usedString, 10, 64)

	if err != nil {
		return computeUsed
	}

	budget, err := strconv.ParseInt(budgetString, 10, 64)

	if err != nil {
		return computeUsed
	}

	computeUsed.SetFrac64(used, budget)
	
	return computeUsed
}
