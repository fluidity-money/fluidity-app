// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHashFromString(t *testing.T) {
	str := "0xMixeDcAseString123"
	hash := HashFromString(str)

	assert.Equal(t, strings.ToLower(str), hash.String())
}

func TestAddressFromString(t *testing.T) {
	str := "0xMixeDcAseString123"
	address := AddressFromString(str)

	assert.Equal(t, strings.ToLower(str), address.String())
}
