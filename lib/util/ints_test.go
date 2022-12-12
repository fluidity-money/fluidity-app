// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package util

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUintMin(t *testing.T) {
	var (
		left  = 2
		right = 9
	)

	want := left
	result1 := UintMin(left, right)
	result2 := UintMin(right, left)

	assert.Equalf(
		t,
		want,
		result1,
		"UintMin(%v, %v) = %v, want match for %#v!",
		left,
		right,
		result1,
		want,
	)

	assert.Equalf(
		t,
		want,
		result2,
		"UintMin(%v, %v) = %v, want match for %#v!",
		left,
		right,
		result2,
		want,
	)
}
