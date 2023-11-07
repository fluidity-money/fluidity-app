// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package applications

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

// applications contains types relevant to supporting events generated
// via interaction with external applications

// Enum that represents supported applications on Ethereum, used to obtain
// application-specific information like fees and senders/recipients.
type Application int64

var applicationNames = []string{
	"none",
	"uniswap_v3",
	"uniswap_v2",
	"balancer_v2",
	"oneinch_v2",
	"oneinch_v1",
	"mooniswap",
	"oneinch_fixedrate",
	"dodo_v2",
	"curve",
	"multichain",
	"xy_finance",
	"apeswap",
	"saddle",
	"gtrade_v6_1",
	"meson",
	"camelot",
	"chronos",
	"sushiswap",
	"kyber_classic",
	"wombat",
	"seawater-amm",
}

// Supported utilities, should map to an entry in the onchain Registry
type UtilityName string

// UtilityFluid is the special utility name for the fluid token itself
var UtilityFluid UtilityName = "FLUID"

type ApplicationDataAmm struct {
	FirstToken  ethereum.Address
	FirstTick   int32
	SecondToken ethereum.Address
	SecondTick  int32
}

type ApplicationData struct {
	AmmPrices ApplicationDataAmm `json:"amm_prices"`
}

type ApplicationFeeData = struct {
	// Fee for the fee paid to the application (in USD)
	Fee *big.Rat `json:"fee"`
	// Volume for the amount of fluid token used (in USD)
	Volume *big.Rat `json:"volume"`
}

func (app Application) String() string {
	return applicationNames[app]
}

func ParseApplicationName(name string) (Application, error) {
	for i, app := range applicationNames {
		if app == name {
			return Application(i), nil
		}
	}

	return 0, fmt.Errorf(
		"unknown app name %s",
		name,
	)
}
