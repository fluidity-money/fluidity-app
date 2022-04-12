package misc

// blob contains byte arrays that should be implicitly coerced into base64
// on the wire and into the database

import (
	sqlDriver "database/sql/driver"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"
)

// Blob is the internal representation of a byte array that's encoded as
// a base64 string when on the wire and in the database
type Blob []byte

func (blob *Blob) UnmarshalJSON(b []byte) (err error) {
	var str string

	if err = json.Unmarshal(b, &str); err != nil {
		return fmt.Errorf(
			"Failed to unmarshal a JSON blob containing %v! %v",
			b,
			err,
		)
	}

	// Padding 0's needed to make len(str) a multiple of 4
	padding := 4 - len(str)%4

	str += strings.Repeat("0", padding)

	*blob, err = base64.StdEncoding.DecodeString(str)

	if err != nil {
		return fmt.Errorf(
			"Failed to decode a blob string of %v to base64! %v",
			str,
			err,
		)
	}

	return
}

func (blob Blob) MarshalJSON() ([]byte, error) {
	str := base64.StdEncoding.EncodeToString(blob)

	bytes, err := json.Marshal(str)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to marshal a blob to string! %v",
			err,
		)
	}

	return bytes, nil
}

func (blob Blob) Value() (sqlDriver.Value, error) {
	return base64.StdEncoding.EncodeToString(blob), nil
}

func (blob *Blob) Scan(v interface{}) error {
	if v == nil {
		return nil
	}

	switch v.(type) {
	case string:
		var err error

		*blob, err = base64.StdEncoding.DecodeString(v.(string))

		if err != nil {
			return fmt.Errorf(
				"Failed to decode a string of %v as base64! %v",
				v.(string),
				err,
			)
		}

	default:
		return fmt.Errorf(
			"Failed to scan type %T content %v into the Blob type!",
			v,
			v,
		)
	}

	return nil
}
