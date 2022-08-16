package xy_finance

import (
	"context"
	"fmt"
	"math"
	"math/big"
	"os"
	"sort"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	uniswap_anchored_view "github.com/fluidity-money/fluidity-app/common/ethereum/uniswap-anchored-view"
	"github.com/fluidity-money/fluidity-app/lib/log"
	libEthereum "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
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
	"name": "symbol",
	"outputs": [
		{
			"name": "",
			"type": "string"
		}
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}]`

var xyFinanceAbi ethAbi.ABI

var erc20Abi ethAbi.ABI

// EnvUniswapAnchoredViewAddress to use to use the Uniswap price oracle to
// get the price the token when making the prize pool
const EnvUniswapAnchoredViewAddress = `FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR`

// ethereumTokenAddress is how XY internally stores the Ethereum token
const ethereumTokenAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

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
func GetXyFinanceSwapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	var (
		// uniswapAnchoredViewAddress is used to get the USD price of a potentially non-stable token
		uniswapAnchoredViewAddress_ = os.Getenv(EnvUniswapAnchoredViewAddress)

		uniswapAnchoredViewAddress = ethCommon.HexToAddress(uniswapAnchoredViewAddress_)
	)

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

	contractAddr_ := transfer.Log.Address.String()
	contractAddr := ethCommon.HexToAddress(contractAddr_)

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
	txHash_ := string(transfer.Transaction.Hash)
	txHash := ethCommon.HexToHash(txHash_)

	txReceipt, err := client.TransactionReceipt(context.Background(), txHash)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to fetch transaction receipts from txHash (%v)! %v",
			txHash.String(),
			err,
		)
	}

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

	if fromTokenIsFluid {
		// Assuming Fluid is a stable coin, USD = Fluid x 1eDecimals
		decimalsAdjusted := math.Pow10(tokenDecimals)
		usdToTokenRatio = new(big.Rat).SetFloat64(decimalsAdjusted)
	} else {
		// Token is potentially non-fluid, use Uniswap Price Oracle
		usdToTokenRatio, err = getUniswapUsdToTokenRatio(client, fromToken, uniswapAnchoredViewAddress)

		if err != nil {
			return nil, fmt.Errorf(
				"Failed to get exchange rate for non-stable token %#v! %v",
				fromToken,
				err,
			)
		}
	}

	// Calculate USD Fee from fromTokenAmount
	feeUsd := calculateXyFinanceSwapFee(
		fromTokenAmount,
		usdToTokenRatio,
		targetChainId,
	)

	return feeUsd, nil
}

// getUniswapUsdToTokenRatio approximates the ratio between Token/USD
// The approximation is derived from a Uniswap Price Oracle contract
func getUniswapUsdToTokenRatio(client *ethclient.Client, tokenAddress, uniswapAnchoredViewAddress ethCommon.Address) (*big.Rat, error) {
	fromTokenAddress_ := tokenAddress.String()
	fromTokenAddress := libEthereum.AddressFromString(fromTokenAddress_)

	if fromTokenAddress == libEthereum.AddressFromString(ethereumTokenAddress) {
		// Set Ethereum token symbol to ETH and call Uniswap Price Oracle
		return uniswap_anchored_view.GetPrice(client, uniswapAnchoredViewAddress, "ETH")
	}

	// Get Token Symbol
	symbol_, err := ethereum.StaticCall(client, tokenAddress, erc20Abi, "symbol")

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to fetch token symbol! %v",
			err,
		)
	}

	tokenSymbol, casted := symbol_[0].(string)

	if !casted {
		return nil, fmt.Errorf(
			"Failed to assert type string from symbol %#v!",
			symbol_,
		)
	}

	// tokenUsdRate is in terms of Token/USD
	tokenUsdRate, err := uniswap_anchored_view.GetPrice(client, uniswapAnchoredViewAddress, tokenSymbol)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get the current exchange rate for %#v from address %#v! %v",
			tokenSymbol,
			uniswapAnchoredViewAddress,
			err,
		)
	}

	return tokenUsdRate, nil
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
