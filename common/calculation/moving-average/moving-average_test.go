package moving_average

import (
	"math/big"
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/stretchr/testify/assert"
)

func TestStoreValue(t *testing.T) {
	var (
		key      = "FLU_TEST_KEY" + t.Name()
		strValue = "1573"
		intValue = 1573
	)

	state.Del(key)
	t.Cleanup(func() {
		state.Del(key)
	})

	StoreValue(key, strValue)
	strResultBytes := state.Lpop(key)

	StoreValue(key, intValue)
	intResultBytes := state.Lpop(key)

	// expect auto coercion
	assert.Equal(t, strValue, string(strResultBytes))
	assert.Equal(t, strValue, string(intResultBytes))
}

func TestCalculateMovingAverage(t *testing.T) {
	var (
		key          = "FLU_TEST_KEY" + t.Name()
		valuesStored = 0
	)

	state.Del(key)
	t.Cleanup(func() {
		state.Del(key)
	})

	// no values
	average, err := CalculateMovingAverage(key)
	assert.NoError(t, err)
	assert.Equal(t, 0, *average)

	// only zeros
	StoreValue(key, 0)
	StoreValue(key, 0)
	valuesStored += 2

	average, err = CalculateMovingAverage(key)
	assert.NoError(t, err)
	assert.Equal(t, 0, *average)

	// real values
	runningTotal := 0

	for i := 1; i < 100; i++ {
		StoreValue(key, i)
		runningTotal += i
		valuesStored += 1
	}

	expectedAverage := runningTotal / 101

	average, err = CalculateMovingAverage(key)
	assert.NoError(t, err)
	assert.Equal(t, expectedAverage, *average)

	// >500 values
	for i := 100; i < BufferSize+1; i++ {
		StoreValue(key, i)
		valuesStored += 1

		// don't include the rightmost value
		if i <= BufferSize {
			runningTotal += i
		}
	}

	expectedAverage = runningTotal / (BufferSize + 1)

	average, err = CalculateMovingAverage(key)
	assert.NoError(t, err)
	assert.Equal(t, expectedAverage, *average)

	// check that we've removed one value when we have >(BufferSize + 1)
	assert.EqualValues(t, BufferSize+1, state.LLen(key))

	// invalid values
	StoreValue(key, "not an int")

	average, err = CalculateMovingAverage(key)

	assert.Error(t, err)
	assert.Nil(t, average)
}

// helpers to reduce verbosity
func ratFromInt(i int) *big.Rat {
	return big.NewRat(int64(i), 1)
}

func ratFromInt64(i int64) *big.Rat {
	return big.NewRat(i, 1)
}

func TestCalculateMovingAverageRat(t *testing.T) {
	var (
		key          = "FLU_TEST_KEY" + t.Name()
		valuesStored = 0
	)

	state.Del(key)
	t.Cleanup(func() {
		state.Del(key)
	})

	// no values
	average, err := CalculateMovingAverageRat(key)
	assert.NoError(t, err)
	assert.Equal(t, ratFromInt(0), average)

	// only zeros
	StoreValue(key, ratFromInt(0).String())
	StoreValue(key, ratFromInt(0).String())
	valuesStored += 2

	average, err = CalculateMovingAverageRat(key)
	assert.NoError(t, err)
	assert.Equal(t, ratFromInt(0), average)

	// real values
	runningTotal := ratFromInt(0)

	for i := 1; i < 100; i++ {
		StoreValue(key, ratFromInt(i).String())
		runningTotal.Add(runningTotal, ratFromInt(i))
		valuesStored += 1
	}

	expectedAverage := big.NewRat(0, 1)
	expectedAverage = expectedAverage.Quo(runningTotal, ratFromInt(101))

	average, err = CalculateMovingAverageRat(key)
	assert.NoError(t, err)
	assert.Equal(t, expectedAverage, average)

	// >500 values
	for i := 100; i < BufferSize+1; i++ {
		StoreValue(key, ratFromInt(i).String())
		valuesStored += 1

		// don't include the rightmost value
		if i <= BufferSize {
			runningTotal.Add(runningTotal, ratFromInt(i))
		}
	}

	expectedAverage = runningTotal.Quo(runningTotal, ratFromInt(BufferSize+1))

	average, err = CalculateMovingAverageRat(key)
	assert.NoError(t, err)
	assert.Equal(t, expectedAverage, average)

	// check that we've removed one value when we have >(BufferSize + 1)
	assert.EqualValues(t, BufferSize+1, state.LLen(key))

	// invalid values
	StoreValue(key, "not a rat")

	average, err = CalculateMovingAverageRat(key)

	assert.Error(t, err)
	assert.Nil(t, average)
}

func TestStoreAndCalculate(t *testing.T) {
	var (
		key   = "FLU_TEST_KEY" + t.Name()
		value = 12
	)

	state.Del(key)
	t.Cleanup(func() {
		state.Del(key)
	})

	result, err := StoreAndCalculate(key, value)
	assert.NoError(t, err)
	assert.Equal(t, value, *result)

	// average is still the same
	result, err = StoreAndCalculate(key, value)
	assert.NoError(t, err)
	assert.Equal(t, value, *result)
}

func TestStoreAndCalculateRat(t *testing.T) {
	var (
		key   = "FLU_TEST_KEY" + t.Name()
		value = ratFromInt(12)
	)

	state.Del(key)
	t.Cleanup(func() {
		state.Del(key)
	})

	result, err := StoreAndCalculateRat(key, value)
	assert.NoError(t, err)
	assert.Equal(t, value, result)

	// average is still the same
	result, err = StoreAndCalculateRat(key, value)
	assert.NoError(t, err)
	assert.Equal(t, value, result)
}
