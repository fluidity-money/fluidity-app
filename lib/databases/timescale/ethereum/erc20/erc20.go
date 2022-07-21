// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package erc20

// erc20 writes Ethereum erc20 logs into Timescale.

const (
	// Context to use when logging
	Context = `TIMESCALE/ETHEREUM/ERC20`

	// TableTransfers to use when writing ERC20 transfers
	TableTransfers = `ethereum_erc20_transfers`
)
