// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

type StakingEvent struct {
	Address      Address
	UsdAmount    misc.BigInt
	LockupLength int
	InsertedDate time.Time
}
