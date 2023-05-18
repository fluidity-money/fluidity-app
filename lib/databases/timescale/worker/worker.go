// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import "github.com/fluidity-money/fluidity-app/lib/types/worker"

const (
	// Context to use for logging
	Context = "TIMESCALE/WORKER"

	// TableAverageAtx to use to get the average ATX from
	TableAverageAtx = "worker_buffered_atx"

	// TableEmissions to record emissions from workers
	TableEmissions = "worker_emissions"
)

type Emission = worker.Emission
