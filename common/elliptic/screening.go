// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package elliptic

import (
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

// IsAddressSafe screening by applying basic rules to test if we should
// reward this address
func IsAddressSafe(network_ network.BlockchainNetwork, address ethereum.Address) bool {
	// unimplemented
	return true
}
