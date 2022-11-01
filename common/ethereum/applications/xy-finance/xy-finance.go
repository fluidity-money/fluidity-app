// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package xy_finance

import (
	"fmt"
	"math"
	"math/big"
	"sort"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	libEthereum "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

const xyFinanceAbiString = `[
{
	"inputs": [
		{
			"internalType": "address",
			"name": "",
			"type": "address"
		}
	],
	"name": "proxies",
	"outputs": [
		{
			"internalType": "bool",
			"name": "",
			"type": "bool"
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
			"internalType": "uint256",
			"name": "_swapId",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "address",
			"name": "_receiver",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint8",
			"name": "_chainId",
			"type": "uint8"
		},
		{
			"components": [
			{
				"internalType": "uint8",
				"name": "chainId",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "dex",
				"type": "address"
			},
			{
				"internalType": "contract IERC20",
				"name": "fromToken",
				"type": "address"
			},
			{
				"internalType": "contract IERC20",
				"name": "toToken",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "swapData",
				"type": "bytes"
			}
			],
			"indexed": false,
			"internalType": "struct Swapper.SwapInfo",
			"name": "_swapInfo",
			"type": "tuple"
		}
	],
	"name": "TargetChainSwap",
	"type": "event"
},
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "uint256",
			"name": "_swapId",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "address",
			"name": "_sender",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint8",
			"name": "_chainId",
			"type": "uint8"
		},
		{
			"components": [
				{
					"internalType": "uint8",
					"name": "chainId",
					"type": "uint8"
				},
				{
					"internalType": "address",
					"name": "dex",
					"type": "address"
				},
				{
					"internalType": "contract IERC20",
					"name": "fromToken",
					"type": "address"
				},
				{
					"internalType": "contract IERC20",
					"name": "toToken",
					"type": "address"
				},
				{
					"internalType": "bytes",
					"name": "swapData",
					"type": "bytes"
				}
			],
			"indexed": false,
			"internalType": "struct Swapper.SwapInfo",
			"name": "_swapInfo",
			"type": "tuple"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "_fromTokenAmount",
			"type": "uint256"
		}
	],
	"name": "SourceChainSwap",
	"type": "event"
}]`

const ERC20AbiString = `[
{
	"constant": true,
	"inputs": [],
	"name": "decimals",
	"outputs": [
		{
			"internalType": "uint8",
			"name": "",
			"type": "uint8"
		}
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}]`

var xyFinanceAbi ethAbi.ABI

var erc20Abi ethAbi.ABI

// List of Day 1 supported stable tokens
var supportedTokens = map[libEthereum.Address]bool{
	"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": true, // USDC
	"0x853d955acef822db058eb8505911ed77f175b99e": true, // Frax
	"0xdac17f958d2ee523a2206206994597c13d831ec7": true, // USDT
	"0x0000000000085d4780b73119b644ae5ecd22b376": true, // TUSD
	"0x6b175474e89094c44da98b954eedeac495271d0f": true, // DAI
}

type xyFee = struct {
	Rate,
	MinUsd,
	MaxUsd *big.Rat
}

var xyFeeTable = map[int]xyFee{
	1:     {big.NewRat(35, 100000), big.NewRat(40, 1), big.NewRat(2000, 1)},  // Ethereum
	56:    {big.NewRat(35, 100000), big.NewRat(9, 10), big.NewRat(2000, 1)},  // BNB
	137:   {big.NewRat(35, 100000), big.NewRat(9, 10), big.NewRat(2000, 1)},  // Polygon
	250:   {big.NewRat(35, 100000), big.NewRat(9, 10), big.NewRat(2000, 1)},  // Fantom
	25:    {big.NewRat(35, 100000), big.NewRat(9, 10), big.NewRat(2000, 1)},  // Cronos
	108:   {big.NewRat(35, 100000), big.NewRat(9, 10), big.NewRat(2000, 1)},  // ThunderCore
	43114: {big.NewRat(35, 100000), big.NewRat(19, 10), big.NewRat(2000, 1)}, // Avalanche
	321:   {big.NewRat(35, 100000), big.NewRat(9, 10), big.NewRat(2000, 1)},  // KCC
	42161: {big.NewRat(35, 100000), big.NewRat(19, 10), big.NewRat(2000, 1)}, // Arbitrum
	10:    {big.NewRat(35, 100000), big.NewRat(19, 10), big.NewRat(2000, 1)}, // Optimism
	592:   {big.NewRat(35, 100000), big.NewRat(9, 10), big.NewRat(2000, 1)},  // Astar
}

// GetXyFinanceSwapFees calculates fees from Swapping TokenA and TokenB crosschain
// Swapped tokens may not be stable, so a price oracle for approximating USD is required
// FeeRates, MinFee and MaxFee are calculated on and depending on the target chain, and is
// approximated via `xyFeeTable`
// xyFeeTable is sourced here: https://docs.xy.finance/products/x-swap/fee-structure
func GetXyFinanceSwapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int, txReceipt *ethTypes.Receipt) (*big.Rat, error) {
	unpacked, err := xyFinanceAbi.Unpack("SourceChainSwap", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack SourceChainSwap log data! %v",
			err,
		)
	}

	expectedUnpackedLen := 8
	if len(unpacked) < expectedUnpackedLen {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected %v, got %v",
			expectedUnpackedLen,
			len(unpacked),
		)
	}

	fromTokenAmount_ := []interface{}{unpacked[3]}

	fromTokenAmount, err := ethereum.CoerceBoundContractResultsToRat(fromTokenAmount_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap amount to rat! %v",
			err,
		)
	}

	addresses_ := unpacked[5:8]

	addresses, err := ethereum.CoerceBoundContractResultsToAddresses(addresses_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce tokenAddresses to addresses! %v",
			err,
		)
	}

	var (
		// swap logs
		// dex is the receiver of the tokenA swap
		// If dex is a proxy, the swap starts a crosschain interaction
		dex = addresses[0]

		// fromToken is the address of tokenA
		fromToken = addresses[1]

		// toToken is the address of tokenB
		toToken = addresses[2]

		// swap topics
		// swap_id is the ID of current swap
		swap_id = transfer.Log.Topics[1]

		fromTokenIsFluid = fromToken == fluidTokenContract

		transferHasFluidToken = fromTokenIsFluid || (toToken == fluidTokenContract)
	)

	if !transferHasFluidToken {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a XY swap %v in transaction %#v not involving the fluid token - skipping!",
				swap_id,
				transfer.Transaction.Hash.String(),
			)
		})

		return nil, nil
	}

	contractAddr_ := transfer.Log.Address
	contractAddr := ethereum.ConvertInternalAddress(contractAddr_)

	// if dex is a proxy, start crosschain swap
	isCrosschainSwap_, err := ethereum.StaticCall(client, contractAddr, xyFinanceAbi, "proxies", dex)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to request whether dex is proxy! %v",
			err,
		)
	}

	isCrosschainSwap, casted := isCrosschainSwap_[0].(bool)

	if !casted {
		return nil, fmt.Errorf(
			"failed to assert type bool from proxies %v! %v",
			isCrosschainSwap_,
			err,
		)
	}

	// XY only takes fees if swap is crosschain
	if !isCrosschainSwap {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a XY swap %v in transaction %#v with no fees - skipping!",
				swap_id,
				transfer.Transaction.Hash.String(),
			)
		})

		return nil, nil
	}

	// Get all logs in transaction
	txHash := ethereum.ConvertInternalHash(transfer.Transaction.Hash)

	txLogs := txReceipt.Logs

	// Binary search through logs until we find matching log
	sourceChainSwapLogBlockIndex := uint(transfer.Log.Index.Uint64())

	sourceChainSwapLogTxIndex := sort.Search(len(txLogs), func(i int) bool {
		// txLogs.Index sorted in ascending order, so use >= op
		return sourceChainSwapLogBlockIndex >= txLogs[i].Index
	})

	// firstTargetChainSwap log should occur right after SourceChainSwap log
	firstTargetChainSwapLogTxIndex := sourceChainSwapLogTxIndex + 1

	// assert corresponding TargetChainSwap exists
	if firstTargetChainSwapLogTxIndex >= len(txLogs) {
		return nil, fmt.Errorf(
			"failed to find corresponding TargetChainSwap log from txHash (%v) at Index (%v)! %v",
			txHash.String(),
			firstTargetChainSwapLogTxIndex,
			err,
		)
	}

	// TargetChainSwap contains the target chain ID, which is used to devive fee params
	targetChainSwapTransferLog := txLogs[firstTargetChainSwapLogTxIndex]

	unpacked, err = xyFinanceAbi.Unpack("TargetChainSwap", targetChainSwapTransferLog.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack SourceChainSwap log data! %v",
			err,
		)
	}

	expectedUnpackedLen = 7
	if len(unpacked) < expectedUnpackedLen {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected %v, got %v",
			expectedUnpackedLen,
			len(unpacked),
		)
	}

	// targetChainId is the chain where XY calculates fees
	targetChainId_ := []interface{}{unpacked[1]}

	targetChainId, err := ethereum.CoerceBoundContractResultsToUint8(targetChainId_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce targetChainId to uint8! %v",
			err,
		)
	}

	// Because XY sets Min/Max Fee in terms of USD, find token conversion rate
	// usdToTokenRatio is defined as Token/USD
	usdToTokenRatio := big.NewRat(1, 1)

	switch true {
	case fromTokenIsFluid:
		// Assuming Fluid is a stable coin, USD = Fluid x 1eDecimals
		decimalsAdjusted := math.Pow10(tokenDecimals)
		usdToTokenRatio = new(big.Rat).SetFloat64(decimalsAdjusted)

	case fromTokenIsSupported(fromToken):
		// Assuming supported tokens are stable coins, USD = Token x 1eDecimals
		decimalsAdjusted := math.Pow10(tokenDecimals)
		usdToTokenRatio = new(big.Rat).SetFloat64(decimalsAdjusted)

	default:
		log.App(func(k *log.Log) {
			k.Format(
				"Received a XY swap %v in transaction %#v with unsupported token %v - skipping!",
				swap_id,
				transfer.Log.TxHash,
				fromToken.String(),
			)
		})

		return nil, nil
	}

	// Calculate USD Fee from fromTokenAmount
	feeUsd := calculateXyFinanceSwapFee(
		fromTokenAmount,
		usdToTokenRatio,
		targetChainId,
	)

	return feeUsd, nil
}

// fromTokenIsSupported checks if fromToken is part of Day 1 supported Eth tokens
func fromTokenIsSupported(token ethCommon.Address) bool {
	tokenAddress := ethereum.ConvertGethAddress(token)

	_, found := supportedTokens[tokenAddress]

	return found
}

// getUsdToTokenRatio approximates the ratio between Token/USD
// Assuming token is stable, approximation is Token * 1eDecimals
func getUsdToTokenRatio(client *ethclient.Client, tokenAddress ethCommon.Address) (*big.Rat, error) {
	// Get Token Decimals
	decimals_, err := ethereum.StaticCall(client, tokenAddress, erc20Abi, "decimals")

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to fetch token decimals! %v",
			err,
		)
	}

	decimals, err := ethereum.CoerceBoundContractResultsToUint8(decimals_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce decimals to uint8 %#v!",
			decimals_,
		)
	}

	// Assuming Fluid is a stable coin, USD = Fluid x 1eDecimals
	decimalsAdjusted := math.Pow10(int(decimals))
	usdToTokenRatio := new(big.Rat).SetFloat64(decimalsAdjusted)

	return usdToTokenRatio, nil
}

// calculateXySwapFee takes 0.035% per transaction of stable-coins, with a minimum and maximum
// fee determined by the target chain.
// usdToTokenRatio is in terms of Token / USD
func calculateXyFinanceSwapFee(amount, usdToTokenRatio *big.Rat, targetChainId uint8) *big.Rat {
	swapFeeParams := xyFeeTable[int(targetChainId)]

	var (
		feeRate = swapFeeParams.Rate
		minUsd  = swapFeeParams.MinUsd
		maxUsd  = swapFeeParams.MaxUsd
	)

	// (amount * feeRate) Token
	feeAmount := new(big.Rat).Mul(amount, feeRate)

	// 1
	bigOne := big.NewRat(1, 1)

	// USD/Token
	tokenToUsdRatio := new(big.Rat).Quo(bigOne, usdToTokenRatio)

	// $(amount * feeRate) USD
	feeAmountUsd := new(big.Rat).Mul(feeAmount, tokenToUsdRatio)

	switch true {
	// feeAmountUsd < minFee -> minFee
	case feeAmountUsd.Cmp(minUsd) < 0:
		return minUsd

	// feeAmountUsd > maxFee -> maxFee
	case feeAmountUsd.Cmp(maxUsd) > 0:
		return maxUsd

	// minUSD <= feeUSD <= maxUSD -> fee
	default:
		return feeAmountUsd
	}
}
