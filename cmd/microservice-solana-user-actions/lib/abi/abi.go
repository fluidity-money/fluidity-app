package abi

// Solana program ABI in golang

import (
	"errors"
	"fmt"

	"github.com/btcsuite/btcutil/base58"
	"github.com/near/borsh-go"
)

var UnknownInstructionError = errors.New("Unknown instruction")

// solana uses borsh encoding, which encodes enums as [tag u8, ...values]

// enum tags for fluidity program instructions
const (
	fluidityWrapDiscriminant = iota
	fluidityUnwrapDiscriminant
	fluidityPayoutDiscriminant
	fluidityInitSolendObligationDiscriminant
	fluidityLogTvlDiscriminant
	fluidityInitDataDiscriminant
)

type (
	// FluidityInstruction is a container storing a single variant of the
	// fluidity instruction enum
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

// enum tags for the SPL token instructions that we care about
// sourced from https://github.com/solana-labs/solana-program-library/blob/fef4438cd128deec675e2d3d5ef91be7d3efe71a/token/program/src/instruction.rs#L537
const (
	splTransferDiscriminant        = 3
	splMintToDiscriminant          = 7
	splBurnDiscriminant            = 8
	splTransferCheckedDiscriminant = 12
)

type (
	// SplInstruction is a container storing a single variant of the SPL Token
	// instruction enum
	SplInstruction struct {
		Transfer        *SplTransfer
		MintTo          *SplMintTo
		Burn            *SplBurn
		TransferChecked *SplTransferChecked
	}

	// SplTransfer represents Transfer(u64), transfering an SPL token
	// between two accounts
	SplTransfer struct {
		Amount uint64
	}

	// SplMintTo represents MintTo(u64), minting a token to an account
	SplMintTo struct {
		Amount uint64
	}

	// SplBurn represents Burn(u64), burning a token from an account
	SplBurn struct {
		Amount uint64
	}

	// SplTransferChecked represents TransferChecked(u64, u8), transfering
	// a token between two accounts with verification of the token decimals
	SplTransferChecked struct {
		Amount   uint64
		Decimals uint8
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
	case fluidityWrapDiscriminant:
		wrap := FluidityWrap{
			Value: decoded.Val,
		}
		instruction.Wrap = &wrap

	case fluidityUnwrapDiscriminant:
		unwrap := FluidityUnwrap{
			Value: decoded.Val,
		}
		instruction.Unwrap = &unwrap

	case fluidityPayoutDiscriminant:
		payout := FluidityPayout{
			Value: decoded.Val,
		}
		instruction.Payout = &payout

	case fluidityInitSolendObligationDiscriminant, fluidityLogTvlDiscriminant, fluidityInitDataDiscriminant:
		// don't care, do nothing
	default:
		return instruction, UnknownInstructionError
	}

	return instruction, nil
}

// DecodeSplInstruction tries to decode base58 encoded solana transaction
// data into one of the SPL token instructions we care about
func DecodeSplInstruction(data string) (SplInstruction, error) {
	var instruction SplInstruction

	byteData := base58.Decode(data)


	var decoded1 struct {
		Discriminant uint8
		Val1         uint64
	}
	var decoded2 struct {
		Discriminant uint8
		Val1         uint64
		Val2         uint8
	}

	var discriminant struct {
		Discriminant uint8
	}

	if err := borsh.Deserialize(&discriminant, byteData); err != nil {
		return instruction, fmt.Errorf("Failed to decode instruction discriminant: %w", err)
	}

	switch discriminant.Discriminant {
	case splTransferDiscriminant:
		if err := borsh.Deserialize(&decoded1, byteData); err != nil {
			return instruction, fmt.Errorf("Failed to decode instruction data: %w", err)
		}

		transfer := SplTransfer{
			Amount: decoded1.Val1,
		}
		instruction.Transfer = &transfer

	case splMintToDiscriminant:
		if err := borsh.Deserialize(&decoded1, byteData); err != nil {
			return instruction, fmt.Errorf("Failed to decode instruction data: %w", err)
		}

		mintTo := SplMintTo{
			Amount: decoded1.Val1,
		}
		instruction.MintTo = &mintTo

	case splBurnDiscriminant:
		if err := borsh.Deserialize(&decoded1, byteData); err != nil {
			return instruction, fmt.Errorf("Failed to decode instruction data: %w", err)
		}

		burn := SplBurn{
			Amount: decoded1.Val1,
		}
		instruction.Burn = &burn

	case splTransferCheckedDiscriminant:
		if err := borsh.Deserialize(&decoded2, byteData); err != nil {
			return instruction, fmt.Errorf("Failed to decode instruction data: %w", err)
		}

		transferChecked := SplTransferChecked{
			Amount:   decoded2.Val1,
			Decimals: decoded2.Val2,
		}
		instruction.TransferChecked = &transferChecked

	default:
		return instruction, UnknownInstructionError
	}

	return instruction, nil
}
