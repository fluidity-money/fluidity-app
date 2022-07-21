// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package postgres

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestClientChannel(t *testing.T) {
	// mock a ready response after 200ms
	go func() {
		time.Sleep(time.Millisecond * 200)
		readyChan <- true
	}()

	// assert that something is returned in a separate goroutine
	assert.Eventually(t, func() bool {
		Client()
		return true
	}, time.Second, time.Millisecond*10, "DB channel opened, but client initialisation didn't return a result!")
}
