package util

import (
	"fmt"
	"strconv"
	"time"
)

// UnixStringToTime parses a string containing a unix timestamp
func UnixStringToTime(unixString string) (*time.Time, error) {
	timestampSeconds, err := strconv.ParseInt(unixString, 10, 64)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to parse timestamp %s, with error %s",
			unixString,
			err,
		)
	}

	t := time.Unix(timestampSeconds, 0)

	return &t, nil
}
