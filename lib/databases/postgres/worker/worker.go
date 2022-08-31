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
)

type (
	WorkerConfigEthereum = worker.WorkerConfigEthereum
	WorkerConfigSolana   = worker.WorkerConfigSolana
)
