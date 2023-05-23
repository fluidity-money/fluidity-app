// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHashFromString(t *testing.T) {
	str := "0xAaAaAaAa"
	hash := HashFromString(str)
	expectedHash := "0x00000000000000000000000000000000000000000000000000000000aaaaaaaa"

	assert.Equal(t, expectedHash, hash.String())
}

func TestAddressFromString(t *testing.T) {
	str := "0xAaAaAaAa"
	address := AddressFromString(str)
	expectedAddres := "0x00000000000000000000000000000000aaaaaaaa"

	assert.Equal(t, expectedAddres, address.String())
}
