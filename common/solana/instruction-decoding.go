package solana

import (
	"errors"
)

// UnknownInstructionError to be returned as a sentinel for when an
// unknown instruction is seen
var UnknownInstructionError = errors.New("Unknown instruction")
