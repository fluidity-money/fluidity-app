// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package queue

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestScanFakeMessages(t *testing.T) {
	strs := scanStrings("", strings.NewReader("Yolo\r\nSwag\r\n"))
	assert.Equal(t, []string{"Yolo", "Swag"}, strs, "Scan string not correct!")
}
