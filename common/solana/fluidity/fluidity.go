package fluidity

import (
	"fmt"

	"github.com/btcsuite/btcutil/base58"
	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/near/borsh-go"
)

const (
	// VariantWrap to wrap spl tokens into fluid tokens
	VariantWrap = iota

	// VariantUnwrap to unwrap fluid tokens to spl tokens
	VariantUnwrap

	// VariantPayout to pay winnings to users
	VariantPayout

	// VariantInitSolendObligation to initialize solend accounts
	VariantInitSolendObligation

	// VariantLogTvl to write the current TVL to an account
	VariantLogTvl

	// 5

	// VariantInitData to initialize contract account
	VariantInitData

	// VariantDrain to drain the prize pool
	VariantDrain
)

var UnknownInstructionError = solana.UnknownInstructionError

type (
	// InstructionPayout that should be serialised using Borsh to call the
	// contract to payout a winner
	InstructionPayout struct {
		Variant   uint8
		Amount    uint64
		TokenName string
		BumpSeed  uint8
	}

	// InstructionDrain used to send payout funds to a receiver
	InstructionDrain struct {
		Variant   uint8
		Amount    uint64
		TokenName string
		BumpSeed  uint8
	}
)

type (
	// FluidityInstruction is a container storing a single variant of the
	// decoded fluidity instruction enum
	FluidityInstruction struct {
		Wrap   *FluidityWrap
		Unwrap *FluidityUnwrap
		Payout *FluidityPayout
	}

	// FluidityWrap represents Wrap(u64), converting from normal -> fluid tokens
	FluidityWrap struct {
		Value uint64
	}

	// FluidityUnwrap represents Unwrap(u64),
	// converting from fluid -> normal tokens
	FluidityUnwrap struct {
		Value uint64
	}

	// FluidityPayout represents Payout(u64), giving a reward payout to two users
	FluidityPayout struct {
		Value uint64
	}
)

// DecodeFluidityInstruction tries to decode base58 encoded solana transaction
// data into a fluidity instruction
func DecodeFluidityInstruction(data string) (FluidityInstruction, error) {
	var instruction FluidityInstruction

	byteData := base58.Decode(data)

	var decoded struct {
		Discriminant uint8
		Val          uint64
	}

	if err := borsh.Deserialize(&decoded, byteData); err != nil {
		return instruction, fmt.Errorf("Failed to decode instruciton data: %w", err)
	}

	switch decoded.Discriminant {
	case VariantWrap:
		wrap := FluidityWrap{
			Value: decoded.Val,
		}
		instruction.Wrap = &wrap

	case VariantUnwrap:
		unwrap := FluidityUnwrap{
			Value: decoded.Val,
		}
		instruction.Unwrap = &unwrap

	case VariantPayout:
		payout := FluidityPayout{
			Value: decoded.Val,
		}
		instruction.Payout = &payout

	case VariantInitSolendObligation, VariantLogTvl, VariantInitData:
		// don't care, do nothing

	default:
		return instruction, UnknownInstructionError
	}

	return instruction, nil
}
