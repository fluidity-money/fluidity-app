// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package erc20

// erc20 implements some of the ERC20 methods with extra information baked in

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

// Transfer made using a ERC20 contract
type Transfer struct {
	ContractAddress ethereum.Address `json:"contract_address"`
	FromAddress     ethereum.Address `json:"from_address"`
	ToAddress       ethereum.Address `json:"to_address"`
	Amount          misc.BigInt      `json:"amount"`

	// PickedUp is when we processed this event
	PickedUp time.Time `json:"time"`

	TransactionHash ethereum.Hash `json:"transaction_hash"`
}
