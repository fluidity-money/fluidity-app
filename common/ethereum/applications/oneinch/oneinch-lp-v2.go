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

const oneInchLiquidityPoolV2AbiString = `[
{
	"inputs": [],
	"name": "fee",
	"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"inputs": [],
	"name": "slippageFee",
	"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
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
			"name": "sender",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "receiver",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "srcToken",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "address",
			"name": "dstToken",
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
			"name": "srcAdditionBalance",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "dstRemovalBalance",
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

const FEE_DECIMALS = 18

// oneInchExchangeAbi set by init.go to generate the ABI code
var oneInchLiquidityPoolV2Abi ethAbi.ABI

// GetUniswapFees returns Uniswap V2's fee of 0.3% of the amount swapped.
// If the token swapped from was the fluid token, get the exact amount,
// otherwise approximate the cost based on the received amount of the fluid token
func GetOneInchLPFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {

	if len(transfer.Log.Topics) != 4 {
		return nil, fmt.Errorf(
			"topics contain the wrong number of values! Expected 4, got %v",
			len(transfer.Log.Topics),
		)
	}

	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	unpacked, err := oneInchLiquidityPoolV2Abi.Unpack("Swapped", transfer.Log.Data)

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

	swapAmounts_ := unpacked[1:5]

	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(swapAmounts_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	// convert the pair contract's address to the go ethereum address type
	contractAddr_ := transfer.Log.Address
	contractAddr := ethCommon.HexToAddress(contractAddr_.String())

	// figure out which token is which in the pair contract
	token0addr_ := transfer.Log.Topics[3]
	token0addr := ethCommon.HexToAddress(token0addr_.String())

	var (
		// swap logs
		// amount is the initial number of Token0
		amount = swapAmounts[0]
		// srcAdditionBalance is amount inside Token0 pool prior to swap
		srcAdditionBalance = swapAmounts[2]
		// dstRemovalBalance is amount inside Token1 pool prior to swap
		dstRemovalBalance = swapAmounts[3]

		fee *big.Rat

		// whether the token being swapped from is the fluid token
		inTokenIsFluid = token0addr == fluidTokenContract
	)

	feeNum_, err := ethereum.StaticCall(client, contractAddr, oneInchLiquidityPoolV2Abi, "fee")

	if err != nil {
		return nil, fmt.Errorf(
			"failed to fetch fee! %v",
			err,
		)
	}

	feeNum, err := ethereum.CoerceBoundContractResultsToRat(feeNum_)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce fee to Rat! %v",
			err,
		)
	}

	slippageFee_, err := ethereum.StaticCall(client, contractAddr, oneInchLiquidityPoolV2Abi, "slippageFee")

	if err != nil {
		return nil, fmt.Errorf(
			"failed to fetch slippageFee! %v",
			err,
		)
	}

	slippageFee, err := ethereum.CoerceBoundContractResultsToRat(slippageFee_)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce slippageFee to Rat! %v",
			err,
		)
	}

	// implementation of LPv1.1 fee calculation
	feeDenom := new(big.Rat).SetFloat64(math.Pow10(FEE_DECIMALS))

	staticFeeMultiplier := new(big.Rat).Quo(feeNum, feeDenom)

	srcStaticFee := new(big.Rat).Quo(amount, staticFeeMultiplier)

	remainingSrcTransferAmount := new(big.Rat).Sub(amount, srcStaticFee)

	newSrcBalance := new(big.Rat).Add(srcAdditionBalance, remainingSrcTransferAmount)

	slippageFeeNum := new(big.Rat).Mul(slippageFee, remainingSrcTransferAmount)

	slippageFeeDenom := new(big.Rat).Mul(feeDenom, newSrcBalance)

	slippageFeeRate := new(big.Rat).Quo(slippageFeeNum, slippageFeeDenom)

	srcDynamicFee := new(big.Rat).Mul(remainingSrcTransferAmount, slippageFeeRate)

	srcTotalFee := new(big.Rat).Add(srcStaticFee, srcDynamicFee)

	// if trading (x + fee) fUSDC -> y Token B, return fUSDC fee
	// else trading (x + fee) Token A -> y fUSDC, return (fUSDC / Token A) fee) Token A
	if inTokenIsFluid {
		fee = srcTotalFee
	} else {
		srcToDstRate := new(big.Rat).Quo(dstRemovalBalance, newSrcBalance)
		fee = fee.Mul(srcTotalFee, srcToDstRate)
	}

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)

	return fee, nil
}
