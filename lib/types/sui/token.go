// Copyright 2024 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package sui

import token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"

// TokenDetails is used to contain information on the underlying token and
// the number of decimal places in another structure.

// TokenDetails used to store information on the underlying token. When
// inserting this information into the database, should be expanded as-is
// and stored literally in the database.

const (
	FluidityModuleName = `fluidity_coin`
	coinTypeSuffix     = `::coin::COIN`
	fluidTypeSuffix    = `::fluidity_coin::FLUIDITY_COIN`
	coinType           = `0x2::coin::Coin`
)

var eventSeparator = `::` + FluidityModuleName + `::`

type SuiToken struct {
	TokenShortName string `json:"token_short_name"`
	TokenDecimals  int    `json:"token_decimals"`
	PackageId      string `json:"package_id"`
	IsFluid        bool   `json:"is_fluid"`
}

// can't define these as const as they contain the package id, which differs by token/network

func (s *SuiToken) Type() string {
	if s.IsFluid {
		return s.PackageId + fluidTypeSuffix
	}
	return s.PackageId + coinTypeSuffix
}

// TokenDetails to convert to the common token details format
func (s *SuiToken) TokenDetails() token_details.TokenDetails {
	return token_details.New(s.TokenShortName, s.TokenDecimals)
}

func (s *SuiToken) Wrap() string {
	return s.PackageId + eventSeparator + "WrapEvent"
}

func (s *SuiToken) Unwrap() string {
	return s.PackageId + eventSeparator + "UnwrapEvent"
}

func (s *SuiToken) DistributeYield() string {
	return s.PackageId + eventSeparator + "DistributeYieldEvent"
}

func (s *SuiToken) ObjectType() string {
	return coinType + "<" + s.Type() + ">"
}
