// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package token_details

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTokenDetails(t *testing.T) {
	name := "fTEST"
	decimals := 6

	expectedDetails := TokenDetails{
		TokenShortName: name,
		TokenDecimals:  decimals,
	}

	details := New(name, decimals)

	assert.Equal(t, expectedDetails, details)
}
