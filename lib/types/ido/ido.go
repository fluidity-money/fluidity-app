// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ido

import (
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

type TvlUpdateContainer struct {
	Network         network.BlockchainNetwork `json:"network"`
	ContractAddress string                    `json:"contract_address"`
	Tvl             uint64                    `json:"tvl"`
}

// ExchangeUpdateContainer contains a rational number representing the rate
// at which options are exchangable for governance tokens, as calculated from
// the KPIs
type ExchangeUpdateContainer struct {
	Network         network.BlockchainNetwork `json:"network"`
	ContractAddress string                    `json:"contract_address"`
	Num             int64                     `json:"num"`
	Denom           int64                     `json:"denom"`
}
