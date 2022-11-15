// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewSolanaEmission(t *testing.T) {
	emission := NewSolanaEmission()
	expectedEmission := &Emission{Network: "solana"}

	assert.Equal(t, expectedEmission, emission)
}
