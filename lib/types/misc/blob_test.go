// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package misc

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type BlobTestSuite struct {
	suite.Suite
	EncodedString string
	DecodedString string
	DecodedBytes  []byte
	Blob          Blob
}

func (suite *BlobTestSuite) SetupTest() {
	suite.DecodedString = "Test B64 String"
	suite.EncodedString = "VGVzdCBCNjQgU3RyaW5n"
	suite.DecodedBytes = []byte(suite.DecodedString)
	suite.Blob.Scan(suite.EncodedString)
}

func TestBlobTestSuite(t *testing.T) {
	suite.Run(t, new(BlobTestSuite))
}

func (suite *BlobTestSuite) TestMarshalJSON() {
	// invalid marshal cannot occur, as base64 encode always returns a valid string
	// and `json.Marshal` always coerces to UTF-8

	// valid marshal
	marshalled, err := suite.Blob.MarshalJSON()
	require.NoError(suite.T(), err)

	// valid unmarshal
	var unmarshalled Blob
	err = unmarshalled.UnmarshalJSON(marshalled)
	require.NoError(suite.T(), err)

	assert.Equal(suite.T(), suite.Blob, unmarshalled)

	// invalid unmarshals
	err = unmarshalled.UnmarshalJSON([]byte("Not JSON!"))
	assert.Error(suite.T(), err)

	err = unmarshalled.UnmarshalJSON([]byte("\"{Not a B64 blob!}\""))
	assert.Error(suite.T(), err)
}

func (suite *BlobTestSuite) TestScanValue() {
	var blob Blob

	suite.T().Run("TestScan", func(t *testing.T) {
		// nil
		err := blob.Scan(nil)
		require.NoError(t, err)
		assert.Zero(t, blob)

		// invalid type
		err = blob.Scan(123456)
		assert.Error(t, err)

		// string
		err = blob.Scan("Invalid String!")
		require.Error(t, err)

		err = blob.Scan(suite.EncodedString)
		require.NoError(t, err)
		assert.EqualValues(t, suite.DecodedBytes, blob)
	})

	suite.T().Run("TestValue", func(t *testing.T) {
		value, err := blob.Value()
		require.NoError(t, err)

		stringValue, ok := value.(string)
		require.True(t, ok, "Failed to cast value to a string!")

		assert.Equal(t, suite.EncodedString, stringValue)
	})
}
