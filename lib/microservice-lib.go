// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package microservice_lib

import "os"

const (
	// EnvWorkerId to use when authenticating as a unique worker in Fluidity
	// infrastructure
	EnvWorkerId = `FLU_WORKER_ID`

	// EnvEnvironmentName variable to use for identifying whether this code is
	// running in production, development or "testing" - which if
	// set will mean some code won't run
	EnvEnvironmentName = `FLU_ENVIRONMENT`
)

// IsTesting consults `FLU_ENVIRONMENT` to see if it's set to "testing"
func IsTesting() bool {
	return os.Getenv(EnvEnvironmentName) == "testing"
}
