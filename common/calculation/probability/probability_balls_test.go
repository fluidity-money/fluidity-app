package probability

import (
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	"github.com/stretchr/testify/assert"
)

func TestNaiveIsWinning(t *testing.T) {
	newBalls := []uint32{5, 1, 2, 6, 8}

	var emission worker.Emission

	i := NaiveIsWinning(newBalls, &emission)

	assert.Equal(t, 3, i, "pickings picking is accurate")
}
