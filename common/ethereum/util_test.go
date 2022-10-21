package ethereum

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBigIntFromUint64(t *testing.T) {
	var (
		x = uint64(105)
		expected = big.NewInt(105)
		empty uint64
	)

	result := BigIntFromUint64(x)
	assert.Equal(t, expected, result)

	expected = &big.Int{}
	result = BigIntFromUint64(empty)
	assert.Equal(t, expected, result)

}

func TestBigIntFromHex(t *testing.T) {
	s := "0x1"
	expected := *big.NewInt(1)

	result, err := BigIntFromHex(s)
	assert.Equal(t, expected, result.Int)
	assert.NoError(t, err)
	
	s = "1"

	result, err = BigIntFromHex(s)
	assert.Nil(t, result)
	assert.Error(t, err)

	s = "0xffff"
	expected = *big.NewInt(65535)

	result, err = BigIntFromHex(s)
	assert.Equal(t, expected, result.Int)
	assert.NoError(t, err)
}

func TestCoerceBoundContractResultsToRat(t *testing.T) {

	t.Run("Empty array, correct length", func(t *testing.T) {
		testValues := make([]interface{}, 1)

		result, err := CoerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Correct length, wrong type", func(t *testing.T) {
		testValues := make([]interface{}, 1)
		testValues[0] = 123

		result, err := CoerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Correct length, correct type", func(t *testing.T) {
		var (
			testValues = make([]interface{}, 1)
			expected   = big.NewRat(123, 1)
			value      = big.NewInt(123)
		)

		testValues[0] = value

		result, err := CoerceBoundContractResultsToRat(testValues)

		assert.Equal(t, expected, result)
		assert.NoError(t, err)
	})

	t.Run("Correct value but non-pointer", func(t *testing.T) {
		var (
			testValues = make([]interface{}, 1)
			intPointer = big.NewInt(123)
		)

		testValues[0] = &intPointer

		result, err := CoerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Correct length, correct type, zero value", func(t *testing.T) {
		var (
			testValues = make([]interface{}, 1)
			expected   = big.NewRat(0, 1)
		)

		testValues[0] = new(big.Int)

		result, err := CoerceBoundContractResultsToRat(testValues)

		assert.Equal(t, expected, result)
		assert.NoError(t, err)
	})

	t.Run("Correct length, correct type, nil", func(t *testing.T) {
		testValues := make([]interface{}, 1)
		testValues[0] = nil

		result, err := CoerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Correct length, correct type, nil pointer", func(t *testing.T) {
		var (
			testValues = make([]interface{}, 1)
			intPointer *big.Int
		)

		testValues[0] = intPointer

		result, err := CoerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Incorrect length", func(t *testing.T) {
		testValues := make([]interface{}, 1)
		testValues = append(testValues, 123)

		result, err := CoerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Int zero", func(t *testing.T) {
		var (
			testValues = make([]interface{}, 1)
			expected   = big.NewRat(0, 1)
		)

		testValues[0] = big.NewInt(0)

		result, err := CoerceBoundContractResultsToRat(testValues)

		assert.Equal(t, expected, result)
		assert.NoError(t, err)
	})
}

func TestCoerceBoundContractResultsToRats(t *testing.T) {
	var (
		testValues = make([]interface{}, 0)
		expected = []*big.Rat{big.NewRat(1,1), big.NewRat(5,1)}
	)

	// length 0
	results, err := CoerceBoundContractResultsToRats(testValues)
	assert.Empty(t, results)
	assert.NoError(t, err)

	// length 2, no values
	testValues = make([]interface{}, 2)

	results, err = CoerceBoundContractResultsToRats(testValues)
	assert.Error(t, err)

	// length 2, 2 values
	testValues[0] = big.NewInt(1)
	testValues[1] = big.NewInt(5)

	results, err = CoerceBoundContractResultsToRats(testValues)

	assert.Equal(t, expected, results)
	assert.NoError(t, err)
}

// same as pyth pow function
func TestBigPow(t *testing.T) {
	// 5 ^ 3 = 125
	expected := big.NewRat(125, 1)
	result := BigPow(big.NewRat(5, 1), 3)

	// 2 ^ 1 = 2
	expected = big.NewRat(2, 1)
	result = BigPow(big.NewRat(2, 1), 1)
	assert.Equal(t, expected, result)

	// -1/2 ^ 2 = 1/4
	expected = big.NewRat(1, 4)
	result = BigPow(big.NewRat(-1, 2), 2)
	assert.Equal(t, expected, result)

	// 25^0 = 1
	expected = big.NewRat(1, 1)
	result = BigPow(big.NewRat(25, 1), 0)
	assert.Equal(t, expected, result)

	// 2 ^ -1 = 1/2
	expected = big.NewRat(1, 2)
	result = BigPow(big.NewRat(2, 1), -1)
	assert.Equal(t, expected, result)

	// 2 ^ -3 = 1/8
	expected = big.NewRat(1, 8)
	result = BigPow(big.NewRat(2, 1), -3)
	assert.Equal(t, expected, result)

	// 0 ^ -1 = undefined (panic)
	assert.PanicsWithValue(t, "division by zero", func() {
		BigPow(big.NewRat(0, 1), -1)
	})
}

func TestCalculateEffectiveGasPrice(t *testing.T) {
	gasPrice := CalculateEffectiveGasPrice(
		new(big.Rat).SetInt64(22_083_465_824), // base fee per gas
		new(big.Rat).SetInt64(40_335_372_944), // max fee per gas
		new(big.Rat).SetInt64(269_305_772), // max priority fee per gas
	)

	testGasPrice := new(big.Rat).SetInt64(22_352_771_596)

	assert.Equal(t, testGasPrice, gasPrice, "effectiveGasPrice calculation")
}
