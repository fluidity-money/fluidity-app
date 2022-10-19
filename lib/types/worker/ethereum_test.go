// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewEthereumEmission(t *testing.T) {
	emission := NewEthereumEmission()
	expectedEmission := &Emission{Network: "ethereum"}

	assert.Equal(t, expectedEmission, emission)
}
