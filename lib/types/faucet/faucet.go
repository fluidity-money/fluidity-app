// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package faucet

// faucet contains code relevant to the faucet webapp

import (
	"fmt"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

type FaucetSupportedToken string

const (
	TokenfUSDT FaucetSupportedToken = `fUSDT`
	TokenfUSDC FaucetSupportedToken = `fUSDC`
	TokenfDAI  FaucetSupportedToken = `fDAI`
)

type (
	// FaucetUser and the last time that they used the faucet
	FaucetUser struct {
		Address string `json:"address"`

		// UniqueAddress that must be tweeted to use the faucet
		UniqueAddress string `json:"unique_address"`

		IpAddress string                    `json:"ip_address"`
		Network   network.BlockchainNetwork `json:"network"`
		LastUsed  time.Time                 `json:"last_used"`

		// TokenName for the type of token this address is related to
		TokenName FaucetSupportedToken `json:"token_name"`
	}

	// FaucetRequest that's sent on our wire to make sure that a user gets a
	// transfer amount sent to them
	FaucetRequest struct {
		Address   string                    `json:"address"`
		Time      time.Time                 `json:"time"`
		Amount    misc.BigInt               `json:"amount"`
		Network   network.BlockchainNetwork `json:"network"`
		TokenName FaucetSupportedToken      `json:"token_name"`
	}
)

func (token FaucetSupportedToken) TokenDecimals() (int64, error) {
	switch token {
	case TokenfDAI:
		return 18, nil
	case TokenfUSDC:
		return 6, nil
	case TokenfUSDT:
		return 6, nil
	default:
		return 0, fmt.Errorf(
			"Trying to obtain decimals of invalid token %#v!",
			token,
		)
	}
}

// TokenFromString to safely convert a string to a supported token
func TokenFromString(s string) (FaucetSupportedToken, error) {
	switch s {
	case string(TokenfDAI):
		return TokenfDAI, nil
	case string(TokenfUSDC):
		return TokenfUSDC, nil
	case string(TokenfUSDT):
		return TokenfUSDT, nil
	default:
		return "", fmt.Errorf(
			"Failed to convert to token! Bad string %#v!",
			s,
		)
	}
}
