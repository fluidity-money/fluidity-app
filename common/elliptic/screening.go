// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package elliptic

import (
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
)

// IsAddressSafe screening by applying basic rules to test if we should
// reward this address, and also storing the address screening results in
// the database so we don't need to mindlessly consume credits
func IsAddressSafe(network_ network.BlockchainNetwork, address ethereum.Address) bool {
	// unimplemented
	isRisky, cached := worker.GetEllipticScreeningIsRisky(network_, address)

	if !cached {
		isRisky = true
	}

	return isRisky
}
