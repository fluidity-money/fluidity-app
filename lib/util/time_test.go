// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package util

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestUnixStringToTime(t *testing.T) {
	var (
		expectedTime     = time.Date(2022, time.February, 9, 04, 50, 27, 0, time.UTC)
		unixDatestamp    = "1644382227"
		invalidDatestamp = "a1644382227"
	)

	resultTime, err := UnixStringToTime(unixDatestamp)

	require.NoError(t, err,
		fmt.Sprintf(
			"UnixStringToTime(%v) = %v, %v, want match for %#v, nil!",
			unixDatestamp,
			resultTime,
			err,
			expectedTime,
		),
	)

	// matching case
	assert.True(t, resultTime.Equal(expectedTime),
		fmt.Sprintf(
			"UnixStringToTime(%v) = %v, %v, want match for %#v, nil!",
			unixDatestamp,
			resultTime,
			err,
			expectedTime,
		),
	)

	resultTime, err = UnixStringToTime(invalidDatestamp)

	// invalid date string case
	assert.Error(t, err,
		fmt.Sprintf(
			"UnixStringToTime(%v) = %v, nil, want match for %#v, %v!",
			unixDatestamp,
			resultTime,
			err,
			expectedTime,
		),
	)
}
