// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

import (
	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

var ManualRewardArguments = ethAbi.Arguments{
	ethAbiMustArgument("winner", "address"),
	ethAbiMustArgument("win_amount", "uint256"),
	ethAbiMustArgument("first_block", "uint256"),
	ethAbiMustArgument("last_block", "uint256"),
}
