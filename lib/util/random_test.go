// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package util

import (
	"fmt"
	"regexp"
	"sort"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestRandomString(t *testing.T) {
	stringLength := 16
	// assume this doesn't exit, as it just wraps log.Fatal
	randomString := RandomString(stringLength)

	isB64, err := regexp.Match("^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$", []byte(randomString))

	require.NoError(t, err,
		fmt.Sprintf(
			"RandomString(%v) failed to match B64 regexp! %v",
			stringLength,
			err,
		),
	)

	assert.Len(t, randomString, stringLength,
		fmt.Sprintf(
			"RandomString(%v) = %v with length %v, want length %v!",
			stringLength,
			randomString,
			len(randomString),
			stringLength,
		),
	)

	assert.True(t, isB64,
		fmt.Sprintf(
			"RandomString(%v) = %v, want B64!",
			stringLength,
			randomString,
		),
	)
}

func TestRandomIntegers(t *testing.T) {
	var (
		amount = 50
		min    = uint32(1)
		max    = uint32(min + uint32(amount) - 1)
	)

	res := RandomIntegers(amount, min, max)

	assert.Len(
		t,
		res,
		amount,
		"RandomIntegers returned the wrong number of ints!",
	)

	sort.Slice(res, func(a, b int) bool {
		return res[a] < res[b]
	})

	expectedRes := make([]uint32, amount)

	for i := range expectedRes {
		expectedRes[i] = min + uint32(i)
	}

	assert.EqualValues(
		t,
		expectedRes,
		res,
		"Random results unexpected!",
	)
}
