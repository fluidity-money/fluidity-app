package fluidity

import (
	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

var ManualRewardArguments = ethAbi.Arguments{
	ethAbiMustArgument("contract",    "address"),
	ethAbiMustArgument("chainid",     "uint256"),
	ethAbiMustArgument("winner",      "address"),
	ethAbiMustArgument("win_amount",  "uint256"),
	ethAbiMustArgument("first_block", "uint256"),
	ethAbiMustArgument("last_block", "uint256"),
}
