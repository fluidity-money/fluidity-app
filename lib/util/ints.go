// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package util

func UintMin(left, right int) int {
	if left > right {
		return right
	} else {
		return left
	}
}
