package fluidity

import (
	"fmt"
)

const (
	// 0
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


// GetBaseToken takes a fluid token and returns its counterpart
func GetBaseToken(token string, fluidTokens map[string]string) (string, error) {

	// get the base token

	baseToken := fluidTokens[token]

	// check that we got a good result

	if baseToken == "" {
		return "", fmt.Errorf(
			"token %v not found when trying to get base token!",
			token,
		)
	}

	return baseToken, nil
}

// IsFluidToken takes a token and checks if is one of the fluid tokens
func IsFluidToken(token string, fluidTokens map[string]string) bool {

	// check if token exists in map
	_, exists := fluidTokens[token]

	return exists
}
