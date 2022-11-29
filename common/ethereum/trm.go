package ethereum

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/web/trm"
)

// FilterTransactions to remove any high risk transactions from a list
// as determined by a TRM address lookup
func FilterTransactions(transactions []ethereum.Transaction) ([]ethereum.Transaction, error) {
	var filteredTransactions []ethereum.Transaction
	addressMap := make(map[string]bool, 0)
	var addresses []string

	// construct address array
	for _, transaction := range transactions {
		addresses = append(addresses, transaction.From.String())
		addresses = append(addresses, transaction.To.String())
	}

	bannedList, err := trm.AreAddressesBanned(addresses, "ethereum")

	// map address: banned
	for i, isBanned := range bannedList {
		addressMap[addresses[i]] = isBanned
	}

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to check if transaction list %v is banned! %v",
			transactions,
			err,
		)
	}

	// figure out if transaction is banned, if not append to result
	for _, t := range transactions {
		toIsBanned := addressMap[t.To.String()]
		fromIsBanned := addressMap[t.From.String()]

		if toIsBanned || fromIsBanned {
			log.App(func(k *log.Log) {
				k.Format(
					"Filtering high-risk transaction from %v to %v!",
					t.To.String(),
					t.From.String(),
				)
			})
		} else {
			filteredTransactions = append(filteredTransactions, t)
		}
	}

	return filteredTransactions, nil
}
