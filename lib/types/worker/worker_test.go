// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUtilityVarsDebugString(t *testing.T) {
	vars := UtilityVars{
		Name:               "123",
		PoolSizeNative:     new(big.Rat).SetInt64(123),
		TokenDecimalsScale: new(big.Rat).SetInt64(999),
		ExchangeRate:       new(big.Rat).SetInt64(8181),
		DeltaWeight:        new(big.Rat).SetInt64(999),
	}

	s := vars.DebugString()

	expected := "123:123:999:8181:999"

	assert.Equal(t, s, expected)
}
