package oneinch

import (
	"fmt"
	"math"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const FixedRateSwapAbiString = `[
{
	"inputs": [],
	"name": "token0",
	"outputs": [
		{
			"internalType": "contract IERC20",
			"name": "",
			"type": "address"
		}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"inputs": [],
	"name": "token1",
	"outputs": [
		{
			"internalType": "contract IERC20",
			"name": "",
			"type": "address"
		}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "trader",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "int256",
			"name": "token0Amount",
			"type": "int256"
		},
		{
			"indexed": false,
			"internalType": "int256",
			"name": "token1Amount",
			"type": "int256"
		}
	],
	"name": "Swap",
	"type": "event"
}]`

var fixedRateSwapAbi ethAbi.ABI

// GetUniswapFees returns Uniswap V2's fee of 0.3% of the amount swapped.
// If the token swapped from was the fluid token, get the exact amount,
// otherwise approximate the cost based on the received amount of the fluid token
func GetFixedRateSwapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed

	unpacked, err := fixedRateSwapAbi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 2 {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected 2, got %v",
			len(unpacked),
		)
	}

	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(unpacked)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	var (
		// swap logs
		// token0Amount is the net difference of token A
		token0Amount = swapAmounts[0]
		// token1Amount is the net difference of token B
		token1Amount = swapAmounts[1]
	)

	// fee is derived under the assumption token0Amount and token1Amount are scaled
	// token0Amount + token1Amount + fee == 0
	fee := new(big.Rat).Add(token0Amount, token1Amount)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)

	return fee, nil
}