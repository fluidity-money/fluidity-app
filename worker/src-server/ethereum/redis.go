package main

import (
	"encoding/json"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/state"
)

func stateGetSetRat(key string, value *big.Rat) (retrieved *big.Rat, err error) {

	bytes := state.GetSet(key, value.String())

	var s string

	if err := json.Unmarshal(bytes, &s); err != nil {
		return nil, fmt.Errorf(
			"failed to unmarshal the value at %#v to a string! %v",
			key,
			err,
		)
	}

	rat, success := new(big.Rat).SetString(s)

	if !success {
		return nil, fmt.Errorf(
			"failed to unmarshal the value at key %#v, value %#v!",
			key,
			s,
		)
	}

	return rat, nil
}
