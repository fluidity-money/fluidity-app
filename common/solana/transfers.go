package solana

import (
	"github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/solana"
)

func ClassifyApplication(transaction solana.TransactionResult, apps map[string]applications.Application) []applications.Application {
	accounts := transaction.Transaction.Message.AccountKeys

	foundApps := make(map[applications.Application]struct{}, 0)

	for _, account := range accounts {
		app, exists := apps[account]
		if !exists {
			continue
		}

		foundApps[app] = struct{}{}
	}

	var appsList []applications.Application

	for app := range foundApps {
		appsList = append(appsList, app)
	}

	return appsList
}
