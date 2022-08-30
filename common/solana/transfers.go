// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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

	appsList := make([]applications.Application, 0)

	for app := range foundApps {
		appsList = append(appsList, app)
	}

	return appsList
}
