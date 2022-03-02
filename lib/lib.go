package microservice_lib

const (
	// EnvWorkerId to use when authenticating as a unique worker in Fluidity
	// infrastructure
	EnvWorkerId = `FLU_WORKER_ID`

	// EnvEnvironmentName variable to use for identifying whether this code is
	// running in production, staging or development
	EnvEnvironmentName = `FLU_ENVIRONMENT`
)
