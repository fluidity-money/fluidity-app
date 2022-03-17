package util

import (
	"fmt"
	"testing"

	microservice_lib "github.com/fluidity-money/fluidity-app/lib"
	"github.com/stretchr/testify/assert"
)

func TestGetEnvOrFatal(t *testing.T) {
	var (
		env   = "FLU_TEST_ENV"
		value = "0xabc_123"
	)

	t.Setenv(env, value)
	result := GetEnvOrFatal(env)

	assert.Equal(t, value, result,
		fmt.Sprintf(
			"GetEnvOrFatal(%v) = %v, want match for %#v!",
			env,
			result,
			value,
		),
	)

	// don't test unset case, as it just wraps log.Fatal
}

func TestGetWorkerId(t *testing.T) {
	id := "ID123"
	t.Setenv(microservice_lib.EnvWorkerId, id)
	result := GetWorkerId()

	assert.Equal(t, id, result,
		fmt.Sprintf(
			"GetWorkerId() = %v, want match for %#v!",
			result,
			id,
		),
	)
}
