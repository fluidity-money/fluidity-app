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

const mooniswapPoolV1AbiString = `[
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "account",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "src",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "dst",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "amount",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "result",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "srcBalance",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "dstBalance",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "totalSupply",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "address",
			"name": "referral",
			"type": "address"
		}
	],
	"name": "Swapped",
	"type": "event"
}]`

var mooniswapPoolV1Abi ethAbi.ABI

// GetMooniswapFees returns Mooniswap's fee of 0.3% of the amount swapped.
// If the token swapped from was the fluid token, get the exact amount,
// otherwise approximate the cost based on the received amount of the fluid token
func GetMooniswapV1Fees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed

	unpacked, err := mooniswapPoolV1Abi.Unpack("Swapped", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 6 {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected 6, got %v",
			len(unpacked),
		)
	}

	// remove last "referrer" address field from logs
	swapAmounts_ := unpacked[:len(unpacked)-1]

	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(swapAmounts_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	if len(transfer.Log.Topics) != 4 {
		return nil, fmt.Errorf(
			"unexpected mooniswap swap log topic length! Expected 4, got %v",
			err,
		)
	}

	token0addr_ := transfer.Log.Topics[2]

	token0addr := ethCommon.HexToAddress(token0addr_.String())

	var (
		// swap logs
		// amount is the amount of in tokens
		amount = swapAmounts[0]
		// result is the amount of out tokens
		result = swapAmounts[1]

		// whether the token being swapped from is the fluid token
		inTokenIsFluid = token0addr == fluidTokenContract
	)

	fee := calculateMooniswapFee(amount, result, inTokenIsFluid)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)

	return fee, nil
}

// if trading x fUSDC -> y Token B
// the fee is x * 0.003 (100% input -> 99.7%)
// if trading y Token B -> x fUSDC
// the fee is x * 0.003009027 (99.7% input -> 100%)
func calculateMooniswapFee(amount, result *big.Rat, amountIsFluid bool) *big.Rat {
	var (
		feeMultiplier       *big.Rat
		fluidTransferAmount *big.Rat
	)

	if amountIsFluid {
		feeMultiplier = big.NewRat(3, 1000)
		fluidTransferAmount = amount
	} else {
		feeMultiplier = big.NewRat(3, 997)
		fluidTransferAmount = result
	}

	fee := new(big.Rat).Mul(fluidTransferAmount, feeMultiplier)

	return fee
}
