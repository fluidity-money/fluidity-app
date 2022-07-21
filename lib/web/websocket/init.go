// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package websocket

import (
	"math/rand"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

func init() {
	if !log.DebugEnabled() {
		return
	}

	rand.Seed(time.Now().Unix())
}
