// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

import (
	"errors"
	solTypes "github.com/fluidity-money/fluidity-app/lib/types/solana"
)

// UnknownInstructionError to be returned as a sentinel for when an
// unknown instruction is seen
var UnknownInstructionError = errors.New("Unknown instruction")

// getAllInstructions extracts instructions and innerInstructions from a solana transaction
func GetAllInstructions(result solTypes.TransactionResult) []solTypes.TransactionInstruction {
	var (
		instructions      = result.Transaction.Message.Instructions
		innerInstructions = result.Meta.InnerInstructions
	)

	baseInstructionsLen := len(instructions)

	allInstructions := make([]solTypes.TransactionInstruction, baseInstructionsLen)

	for i, instruction := range instructions {
		allInstructions[i] = instruction
	}

	for _, inner := range innerInstructions {
		allInstructions = append(allInstructions, inner.Instructions...)
	}

	return allInstructions
}
