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

	instructionsLen := len(instructions) + len(innerInstructions)

	allInstructions := make([]solTypes.TransactionInstruction, instructionsLen)

	allInstructions = append(allInstructions, instructions...)

	for _, inner := range innerInstructions {
		allInstructions = append(allInstructions, inner.Instructions...)
	}

	return allInstructions
}

