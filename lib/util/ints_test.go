package util

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUintMin(t *testing.T) {
	var (
		left  = 2
		right = 9
	)

	want := left
	result1 := UintMin(left, right)
	result2 := UintMin(right, left)

	assert.Equal(t, want, result1,
		fmt.Sprintf(
			"UintMin(%v, %v) = %v, want match for %#v!",
			left,
			right,
			result1,
			want,
		),
	)

	assert.Equal(t, want, result2,
		fmt.Sprintf(
			"UintMin(%v, %v) = %v, want match for %#v!",
			left,
			right,
			result2,
			want,
		),
	)
}
