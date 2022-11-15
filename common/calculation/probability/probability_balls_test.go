// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a Creative Commons license that can be found in the
// LICENSE_TRF.md file.

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
