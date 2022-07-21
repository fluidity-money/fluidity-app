// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package microservice_lib

const (
	// EnvWorkerId to use when authenticating as a unique worker in Fluidity
	// infrastructure
	EnvWorkerId = `FLU_WORKER_ID`

	// EnvEnvironmentName variable to use for identifying whether this code is
	// running in production, staging or development
	EnvEnvironmentName = `FLU_ENVIRONMENT`
)
