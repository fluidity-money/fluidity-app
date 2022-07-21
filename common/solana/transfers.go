// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

import (
	"github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/solana"
)

func ClassifyApplication(transaction solana.TransactionResult, apps map[string]applications.Application) *applications.Application {
	var (
		accounts = transaction.Transaction.Message.AccountKeys
	)

	var foundApp *applications.Application

	for _, account := range accounts {
		app, exists := apps[account]
		if !exists {
			continue
		}

		// only set spl if we haven't found a more interesting app
		if app == applications.ApplicationSpl && foundApp != nil {
			continue
		}

		foundApp = &app
	}

	return foundApp
}
