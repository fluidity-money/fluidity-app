package fluidity

import (
	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

var ManualRewardArguments = ethAbi.Arguments{
	ethAbiMustArgument("txHash",     "bytes32"),
	ethAbiMustArgument("from",       "address"),
	ethAbiMustArgument("to",         "address"),
	ethAbiMustArgument("win_amount", "uint256"),
}
