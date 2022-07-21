// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package payout

type TrfVars struct {
	Chain   string
	Network string

	PayoutFreqNum    int64
	PayoutFreqDenom  int64
	DeltaWeightNum   int64
	DeltaWeightDenom int64
	WinningClasses   int
}
