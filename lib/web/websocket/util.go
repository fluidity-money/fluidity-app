// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package websocket

import "math/rand"

func generateSubscriptionId() int {
	return rand.Intn(1000)
}
