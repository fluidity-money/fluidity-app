// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

import (
	"errors"
)

// UnknownInstructionError to be returned as a sentinel for when an
// unknown instruction is seen
var UnknownInstructionError = errors.New("Unknown instruction")
