package spl_token

import (
	"fmt"

	"github.com/btcsuite/btcutil/base58"
	"github.com/fluidity-money/fluidity-app/common/solana"

	"github.com/near/borsh-go"
)

var UnknownInstructionError = solana.UnknownInstructionError

type (
	// SplInstruction is a container storing a single variant of the decoded
	// SPL Token instruction enum
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
	case VariantTransfer:
		if err := borsh.Deserialize(&decoded1, byteData); err != nil {
			return instruction, fmt.Errorf("Failed to decode instruction data: %w", err)
		}

		transfer := SplTransfer{
			Amount: decoded1.Val1,
		}
		instruction.Transfer = &transfer

	case VariantMintTo:
		if err := borsh.Deserialize(&decoded1, byteData); err != nil {
			return instruction, fmt.Errorf("Failed to decode instruction data: %w", err)
		}

		mintTo := SplMintTo{
			Amount: decoded1.Val1,
		}
		instruction.MintTo = &mintTo

	case VariantBurn:
		if err := borsh.Deserialize(&decoded1, byteData); err != nil {
			return instruction, fmt.Errorf("Failed to decode instruction data: %w", err)
		}

		burn := SplBurn{
			Amount: decoded1.Val1,
		}
		instruction.Burn = &burn

	case VariantTransferChecked:
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
