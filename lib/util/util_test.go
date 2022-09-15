// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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

func TestGetEnvOrDefault(t *testing.T) {
	const (
		EnvTestValue      = "FLU_TEST_VALUE"
		ExpectedTestValue = "987tuv"
		DefaultTestValue  = "my_default"
	)

	// exists, is value
	t.Setenv(EnvTestValue, ExpectedTestValue)
	env := GetEnvOrDefault(EnvTestValue, DefaultTestValue)
	assert.Equal(t, ExpectedTestValue, env)

	// doesn't exist, is default
	t.Setenv(EnvTestValue, "")
	env = GetEnvOrDefault(EnvTestValue, DefaultTestValue)
	assert.Equal(t, DefaultTestValue, env)
}

func TestGetHash(t *testing.T) {
	tests := [][]byte{
		[]byte("abcdef"),
		[]byte("99999"),
	}
	results := []string{
		"bef57ec7f53a6d40beb640a780a639c83bc29ac8a9816f1fc6c5c6dcd93c4721",
		"fd5f56b40a79a385708428e7b32ab996a681080a166a2206e750eb4819186145",
	}

	for i, test := range tests {
		expectedHash := results[i]
		hash := GetB16Hash(test)
		// compare to precomputed hex hashes
		assert.Equal(t, expectedHash, hash)
	}
}
