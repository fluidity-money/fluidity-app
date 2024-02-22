// Copyright 2024 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package sui

// TokenDetails is used to contain information on the underlying token and
// the number of decimal places in another structure.

// TokenDetails used to store information on the underlying token. When
// inserting this information into the database, should be expanded as-is
// and stored literally in the database.

const (
	FluidityModuleName = `fluidity_coin`
	typeSuffix         = `::fluidity_coin::FLUIDITY_COIN`
	coinType           = `0x2::coin::Coin`
)

var eventSeparator = `::` + FluidityModuleName + `::`

type SuiToken struct {
	TokenShortName string `json:"token_short_name"`
	TokenDecimals  int    `json:"token_decimals"`
	PackageId      string `json:"package_id"`
}

// can't define these as const as they contain the package id, which differs by token/network

func (s *SuiToken) Type() string {
	return s.PackageId + typeSuffix
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
