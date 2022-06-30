package fluidity

import (
	"encoding/json"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
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

// EnvSolanaTokenLookups is the map of fluid -> base tokens
const EnvSolanaTokenLookups = `FLU_SOLANA_TOKEN_LOOKUPS`

// GetBaseToken takes a fluid token and returns its counterpart
func GetBaseToken(token string) (string, error) {

	fluidTokenString := util.GetEnvOrFatal(EnvSolanaTokenLookups)

	// map of fluid -> base tokens

	var fluidTokens map[string]string

	err := json.Unmarshal([]byte(fluidTokenString), &fluidTokens)

	if err != nil {
		return "", fmt.Errorf(
			"failed to unmarshal fluid to base token map from env string %#v! %v",
			fluidTokenString,
			err,
		)
	}

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
func IsFluidToken(token string) bool {

	fluidTokenString := util.GetEnvOrFatal(EnvSolanaTokenLookups)

	// map of fluid -> base tokens

	var fluidTokens map[string]string

	err := json.Unmarshal([]byte(fluidTokenString), &fluidTokens)

	if err != nil {
		log.Debugf(
			"failed to unmarshal fluid to base token map from env string %#v! %v",
			fluidTokenString,
			err,
		)
		return false
	}

	// check if token exists in map
	_, exists := fluidTokens[token]

	return exists
}
