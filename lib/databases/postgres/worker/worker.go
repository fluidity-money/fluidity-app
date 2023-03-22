// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

// worker for postgres contains worker variables

import "github.com/fluidity-money/fluidity-app/lib/types/worker"

const (
	// Context to use for logging
	Context = "POSTGRES/WORKER"

	// TableWorkerConfigEthereum to use for retrieving worker server
	// configuration for EVM chains
	TableWorkerConfigEthereum = "worker_config_ethereum"

	// TableWorkerConfigSolana to use for retrieving worker server
	// configuration for Solana
	TableWorkerConfigSolana = "worker_config_solana"

	// TableFeeSwitch is used to replace addresses that would normally be
	// paid out with another address for the fee switching feature until we
	// have Fluidity V2 up
	TableFeeSwitch = "fee_switch"
)

type (
	WorkerConfigEthereum = worker.WorkerConfigEthereum
	WorkerConfigSolana   = worker.WorkerConfigSolana
	FeeSwitch            = worker.FeeSwitch
)
