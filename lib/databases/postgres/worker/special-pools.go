// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"database/sql"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const TablePoolOverrides = `worker_custom_pool_overrides`

func GetSpecialPoolOverrides(network_ network.BlockchainNetwork, poolName applications.UtilityName) (worker.SpecialPoolOptions, bool) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(`
		SELECT
			payout_freq_num,
			payout_freq_denom,
			winning_classes
		FROM %s
		WHERE network = $1 AND utility_name = $2`,

		TablePoolOverrides,
	)

	row := postgresClient.QueryRow(statementText, network_, poolName)

	if err := row.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get special pool overrides!"
			k.Payload = err
		})
	}

	var (
		poolOverrides worker.SpecialPoolOptions
		payoutFreqNum misc.BigInt
		payoutFreqDenom misc.BigInt
	)

	err := row.Scan(
		&payoutFreqNum,
		&payoutFreqDenom,
		&poolOverrides.WinningClassesOverride,
	)

	switch err {
	case sql.ErrNoRows:
		log.Debug(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"No pool override found for app %s, network %s",
				poolName,
				network_,
			)
		})

		return poolOverrides, false

	case nil:
		// do nothing

	default:
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to decode special pool overrides!"
			k.Payload = err
		})
	}

	poolOverrides.PayoutFreqOverride = new(big.Rat).SetFrac(&payoutFreqNum.Int, &payoutFreqDenom.Int)

	return poolOverrides, true
}
