package compound

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCoerceBoundContractResultsToRat(t *testing.T) {

	t.Run("Empty array, correct length", func(t *testing.T) {
		testValues := make([]interface{}, 1)

		result, err := coerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Correct length, wrong type", func(t *testing.T) {
		testValues := make([]interface{}, 1)
		testValues[0] = 123

		result, err := coerceBoundContractResultsToRat(testValues)

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

		result, err := coerceBoundContractResultsToRat(testValues)

		assert.Equal(t, expected, result)
		assert.NoError(t, err)
	})

	t.Run("Correct value but non-pointer", func(t *testing.T) {
		var (
			testValues = make([]interface{}, 1)
			intPointer = big.NewInt(123)
		)

		testValues[0] = &intPointer

		result, err := coerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Correct length, correct type, zero value", func(t *testing.T) {
		var (
			testValues = make([]interface{}, 1)
			expected   = big.NewRat(0, 1)
		)

		testValues[0] = new(big.Int)

		result, err := coerceBoundContractResultsToRat(testValues)

		assert.Equal(t, expected, result)
		assert.NoError(t, err)
	})

	t.Run("Correct length, correct type, nil", func(t *testing.T) {
		testValues := make([]interface{}, 1)
		testValues[0] = nil

		result, err := coerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Correct length, correct type, nil pointer", func(t *testing.T) {
		var (
			testValues = make([]interface{}, 1)
			intPointer *big.Int
		)

		testValues[0] = intPointer

		result, err := coerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Incorrect length", func(t *testing.T) {
		testValues := make([]interface{}, 1)
		testValues = append(testValues, 123)

		result, err := coerceBoundContractResultsToRat(testValues)

		assert.Nil(t, result)
		assert.Error(t, err)
	})

	t.Run("Int zero", func(t *testing.T) {
		var (
			testValues = make([]interface{}, 1)
			expected   = big.NewRat(0, 1)
		)

		testValues[0] = big.NewInt(0)

		result, err := coerceBoundContractResultsToRat(testValues)

		assert.Equal(t, expected, result)
		assert.NoError(t, err)
	})
}

// same as pyth pow function
func TestBigPow(t *testing.T) {
	// 5 ^ 3 = 125
	expected := big.NewRat(125, 1)
	result := bigPow(big.NewRat(5, 1), 3)

	// 2 ^ 1 = 2
	expected = big.NewRat(2, 1)
	result = bigPow(big.NewRat(2, 1), 1)
	assert.Equal(t, expected, result)

	// -1/2 ^ 2 = 1/4
	expected = big.NewRat(1, 4)
	result = bigPow(big.NewRat(-1, 2), 2)
	assert.Equal(t, expected, result)

	// 25^0 = 1
	expected = big.NewRat(1, 1)
	result = bigPow(big.NewRat(25, 1), 0)
	assert.Equal(t, expected, result)

	// 2 ^ -1 = 1/2
	expected = big.NewRat(1, 2)
	result = bigPow(big.NewRat(2, 1), -1)
	assert.Equal(t, expected, result)

	// 2 ^ -3 = 1/8
	expected = big.NewRat(1, 8)
	result = bigPow(big.NewRat(2, 1), -3)
	assert.Equal(t, expected, result)

	// 0 ^ -1 = undefined (panic)
	assert.PanicsWithValue(t, "division by zero", func() {
		bigPow(big.NewRat(0, 1), -1)
	})
}
