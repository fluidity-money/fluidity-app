package misc

// big_int contains exceedingly large numbers, wrapping big.Int

import (
	sqlDriver "database/sql/driver"
	"encoding/json"
	"fmt"
	"math/big"
)

// BigInt contains big.Int and has some extra functions to support storage
// in the database with the type NUMERIC(78, 0).
type BigInt struct {
	big.Int
}

func BigIntFromString(s string) (*BigInt, error) {
	var int BigInt

	if _, success := int.SetString(s, 10); !success {
		return nil, fmt.Errorf(
			"Failed to set the bigint! Bad string number!",
		)
	}

	return &int, nil
}

func BigIntFromHex(hex string) (*BigInt, error) {
	var (
		int    BigInt
		hexStr = hex[2:]
	)

	if _, success := int.SetString(hexStr, 16); !success {
		return nil, fmt.Errorf(
			"Failed to set the bigint! Bad hex number!",
		)
	}

	return &int, nil
}

func BigIntFromInt64(x int64) BigInt {
	var int BigInt

	int.SetInt64(x)

	return int
}

func BigIntFromUint64(x uint64) BigInt {
	var int BigInt

	int.SetUint64(x)

	return int
}

func NewBigInt(x big.Int) BigInt {
	return BigInt{x}
}

func (i *BigInt) UnmarshalJSON(b []byte) error {
	var str string

	if err := json.Unmarshal(b, &str); err != nil {
		return fmt.Errorf(
			"failed to unmarshal a JSON marshalled byte array of %v to a string! %v",
			b,
			err,
		)
	}

	if has0xPrefix(str) {
		int, err := BigIntFromHex(str)

		if err != nil {
			return fmt.Errorf(
				"Failed to unharsmal a BigInt of %v! %v",
				str,
				err,
			)
		}

		*i = *int

		return nil
	}

	int, err := BigIntFromString(str)

	if err != nil {
		return fmt.Errorf(
			"failed to unharsmal a BigInt of %v! %v",
			str,
			err,
		)
	}

	*i = *int

	return nil
}

func (i BigInt) MarshalJSON() ([]byte, error) {
	return json.Marshal(i.String())
}

func (int BigInt) Value() (sqlDriver.Value, error) {
	return int.String(), nil
}

// Scan types into BigInt, supporting NUMERIC(78, 0), int64, uint64
func (int *BigInt) Scan(v interface{}) error {
	if v == nil {
		return nil
	}

	switch v.(type) {
	case int64:
		n := BigIntFromInt64(v.(int64))
		*int = n

	case uint64:
		n := BigIntFromUint64(v.(uint64))
		*int = n

	case []uint8:
		uint8 := v.([]uint8)

		int_, err := BigIntFromString(string(uint8))

		if err != nil {
			return fmt.Errorf(
				"Failed to scan uint8[] using the BigIntFromString function! %v",
				err,
			)
		}

		*int = *int_

	default:
		return fmt.Errorf(
			"Failed to scan type %T content %v into the BigInt type!",
			v,
			v,
		)
	}

	return nil
}
