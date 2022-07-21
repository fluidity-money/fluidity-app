// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package misc

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type BigIntTestSuite struct {
	suite.Suite
	Expected BigInt
}

func (suite *BigIntTestSuite) SetupTest() {
	var inner big.Int
	inner.SetInt64(100)

	suite.Expected = BigInt{inner}
}

func TestBigIntTestSuite(t *testing.T) {
	suite.Run(t, new(BigIntTestSuite))
}

func (suite *BigIntTestSuite) TestBigIntFromOther() {

	suite.T().Run("FromString", func(t *testing.T) {
		result, err := BigIntFromString("100")
		require.NoError(t, err)
		assert.Equal(t, &suite.Expected, result)

		_, err = BigIntFromString("100aa")
		assert.Error(t, err)
	})

	suite.T().Run("FromInt", func(t *testing.T) {
		result := BigIntFromInt64(100)
		assert.Equal(t, suite.Expected, result)
	})

	suite.T().Run("FromUint", func(t *testing.T) {
		result := BigIntFromUint64(100)
		assert.Equal(t, suite.Expected, result)
	})

	suite.T().Run("NewBigInt", func(t *testing.T) {
		var inner big.Int
		inner.SetInt64(100)

		result := NewBigInt(inner)
		assert.Equal(t, suite.Expected, result)
	})

	suite.T().Run("MarshalJSON", func(t *testing.T) {
		marshalled, err := suite.Expected.MarshalJSON()
		require.NoError(t, err)

		var unmarshalled BigInt
		err = unmarshalled.UnmarshalJSON(marshalled)
		require.NoError(t, err)

		assert.Equal(t, suite.Expected, unmarshalled)

		err = unmarshalled.UnmarshalJSON([]byte("Not JSON!"))
		assert.Error(t, err)

		err = unmarshalled.UnmarshalJSON([]byte("\"{Not a BigInt internally!}\""))
		assert.Error(t, err)
	})
}

func (suite *BigIntTestSuite) TestValue() {
	// expect cast to a string
	value, err := suite.Expected.Value()
	require.NoError(suite.T(), err)

	stringValue, ok := value.(string)
	require.True(suite.T(), ok, "Failed to cast value to a string!")

	assert.Equal(suite.T(), suite.Expected.String(), stringValue)
}

func (suite *BigIntTestSuite) TestScan() {
	var b BigInt

	// nil
	err := b.Scan(nil)
	assert.NoError(suite.T(), err)
	assert.Zero(suite.T(), b)

	// int64
	err = b.Scan(suite.Expected.Int64())
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), suite.Expected, b)

	// uint64
	err = b.Scan(suite.Expected.Uint64())
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), suite.Expected, b)

	// []uint8
	bytes, err := suite.Expected.MarshalText()
	require.NoError(suite.T(), err)

	err = b.Scan(bytes)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), suite.Expected, b)

	err = b.Scan([]byte("An invalid string"))
	assert.Error(suite.T(), err)

	// invalid type
	err = b.Scan("An invalid string")
	assert.Error(suite.T(), err)
}
