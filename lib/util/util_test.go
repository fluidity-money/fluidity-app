// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package util

import (
	"fmt"
	"testing"

	"github.com/ethereum/go-ethereum/common/hexutil"
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
		"0x1f8ac10f23c5b5bc1167bda84b833e5c057a77d2",
		"0xa045b7efa463c6ed195c644163f4168952fbd34a",
	}

	for i, test := range tests {
		expectedHash := results[i]
		hash := GetHash(test)
		// compare to precomputed hex hashes
		hashHex := hexutil.Encode([]byte(hash))
		assert.Equal(t, expectedHash, hashHex)
	}
}
