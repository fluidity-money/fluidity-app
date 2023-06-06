// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package moving_average

// use redis with the state package in fluidity-app/lib to store a ring
// buffer and recalculate moving averages on the fly

import (
	"fmt"
	"math"
	"math/big"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/state"
)

// DefaultBufferSize to use when storing the ring buffer
const DefaultBufferSize = 500

// StoreValue by storing the value as-is in redis
func StoreValue(key string, x interface{}) {
	state.LPush(key, x)
}

// CalculateMovingAverageAndSumMaybePop with the limit given, by getting
// a range over each item then popping anything that exceeds the limit if
// the flag is set
func CalculateMovingAverageAndSumMaybePop(key string, limit int, shouldPopIfExcess bool) (average int, sum int, err error) {
	listLength_ := state.LLen(key)

	if listLength_ > math.MaxInt {
		return 0, 0, fmt.Errorf(
			"key list %#v length too large: %v",
			key,
			listLength_,
		)
	}

	listLength := int(listLength_)

	shouldPop := listLength > limit && shouldPopIfExcess

	// should only pop if there's excess and the argument is set

	if shouldPop {
		state.RPopCount(key, listLength-limit)
	}

	valuesBytes := state.LRange(key, 0, int64(limit))

	// avoid dividing by zero if no bytes are stored
	if listLength == 0 {
		return 0, 0, nil
	}

	for _, valueBytes := range valuesBytes {
		s := string(valueBytes)

		value, err := strconv.Atoi(s)

		if err != nil {
			return 0, 0, fmt.Errorf(
				"failed to convert %#v to an int for an average conversion from Redis! %v",
				s,
				err,
			)
		}

		average += value

		sum += value
	}

	amount := average / listLength

	return amount, sum, nil
}

// CalculateMovingAverage by taking the key given and calculating the
// current moving average by scanning the current list
func CalculateMovingAverage(key string) (int, error) {

	valuesBytes := state.LRange(key, 0, DefaultBufferSize)

	valuesBytesLen := len(valuesBytes)

	if valuesBytesLen > DefaultBufferSize {
		state.Rpop(key)
	}

	// avoid dividing by zero if no bytes are stored
	if valuesBytesLen == 0 {
		return 0, nil
	}

	var average int

	for _, valueBytes := range valuesBytes {

		s := string(valueBytes)

		value, err := strconv.Atoi(s)

		if err != nil {
			return 0, fmt.Errorf(
				"failed to convert %#v to an int for an average conversion from Redis! %v",
				s,
				err,
			)
		}

		average += value
	}

	amount := average / valuesBytesLen

	return amount, nil
}

func CalculateMovingAverageRat(key string) (*big.Rat, error) {

	valuesBytes := state.LRange(key, 0, DefaultBufferSize)

	valuesBytesLen := len(valuesBytes)

	valuesBytesLenRat := new(big.Rat).SetInt64(int64(valuesBytesLen))

	if valuesBytesLen > DefaultBufferSize {
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
func StoreAndCalculate(key string, x int) (int, error) {
	StoreValue(key, x)
	return CalculateMovingAverage(key)
}

func StoreAndCalculateRat(key string, x *big.Rat) (*big.Rat, error) {
	s := x.String()
	StoreValue(key, s)
	return CalculateMovingAverageRat(key)
}
