package moving_average

// use redis with the state package in fluidity-app/lib to store a ring
// buffer and recalculate moving averages on the fly

import (
	"fmt"
	"strconv"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/state"
	)

// BufferSize to use when storing the ring buffer
const BufferSize = 500

// StoreValue by remembering a rational number in Redis
func StoreValue(key string, x interface{}) {
	state.LPush(key, x)
}

// CalculateMovingAverage by taking the key given and calculating the
// current moving average by scanning the current list
func CalculateMovingAverage(key string) (*int, error) {

	valuesBytes := state.LRange(key, 0, BufferSize)

	valuesBytesLen := len(valuesBytes)

	if valuesBytesLen > BufferSize {
			state.Rpop(key)
		}

	// avoid dividing by zero if no bytes are stored
	if valuesBytesLen == 0 {
			zero := 0
			return &zero, nil
		}

	var average int

	for _, valueBytes := range valuesBytes {
	
		s := string(valueBytes)

		value, err := strconv.Atoi(s)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert %#v to an int for an average conversion from Redis! %v",
				value,
				err,
			)
		}

		average += value
	}

	amount := average / valuesBytesLen

	return &amount, nil
}

func CalculateMovingAverageRat(key string) (*big.Rat, error) {

	valuesBytes := state.LRange(key, 0, BufferSize)

	valuesBytesLen := len(valuesBytes)

	valuesBytesLenRat := new(big.Rat).SetInt64(int64(valuesBytesLen))

	if valuesBytesLen > BufferSize {
			state.Rpop(key)
		}

	// avoid dividing by zero if no bytes are stored
	if valuesBytesLen == 0 {
			zero := big.NewRat(0, 1)
			return zero, nil
		}

	average := new(big.Rat)

	for _, valueBytes := range valuesBytes {
	
		s := string(valueBytes)

		rat, success := new(big.Rat).SetString(s)
	
		if !success {
			return nil, fmt.Errorf(
				"%#v is not a rational number!",
				s,
			)
		}

		average.Add(average, rat)
	}

	average.Quo(average, valuesBytesLenRat)

	return average, nil
}


// StoreAndCalculate the moving average by storing the amount then doing
// the calculation
func StoreAndCalculate(key string, x int) (*int, error) {
	StoreValue(key, x)
	return CalculateMovingAverage(key)
}

func StoreAndCalculateRat(key string, x *big.Rat) (*big.Rat, error) {
	s := x.String()
	StoreValue(key, s)
	return CalculateMovingAverageRat(key)
}

