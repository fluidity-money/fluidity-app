// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetBinary(t *testing.T) {
	account := Account{
		Lamports: 1461600,
		Owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
		Data: []string{"AQAAAGoZ0VWnJlJ10jlZkMLDW3BYdruTGDwWKc7zDoWRCRbJmNyBLOMdAAAGAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==", "base64"},
		Executable: false,
		RentEpoch: 371,
	}

	// valid
	b, err := account.GetBinary()
	expectedBytes := []byte{1, 0, 0, 0, 106, 25, 209, 85, 167, 38, 82, 117, 210, 57, 89, 144, 194, 195, 91, 112, 88, 118, 187, 147, 24, 60, 22, 41, 206, 243, 14, 133, 145, 9, 22, 201, 152, 220, 129, 44, 227, 29, 0, 0, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}

	assert.NoError(t, err)
	assert.Equal(t, expectedBytes, b)

	// invalid data (base58)
	d := account
	d.Data[0] = "DK9N2hkXF8qJpNVSDKT4f9t3anZfz8N3Adzv4VJbQs6LGr4cey7oasa3agVK4TB1aMED5tM2Mx23vE6TuzaJoxzmqA9kH1wtv79nrXAV6zvi8eB"
	b, err = d.GetBinary()
	assert.Error(t, err)
	assert.Zero(t, b)

	// wrong data length
	c := account
	c.Data = append(c.Data, "a")
	b, err = c.GetBinary()
	assert.Error(t, err)
	assert.Zero(t, b)

	// wrong encoding
	account.Data[1] = "base58"
	b, err = account.GetBinary()
	assert.Error(t, err)
	assert.Zero(t, b)
}
