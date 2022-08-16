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

const (
	// targetChainSwapLogTopic is the log hash of swaps performed on the target chain
	targetChainSwapLogTopic = "0x9017d19859618ad034f86e0edfd056f1be7c02aed9b0904276fabae9df9a4d3e"

	// ethereumTokenAddress is how XY internally stores the Ethereum token
	etherumTokenAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
)

type xyFee = struct {
	Rate,
	MinUsd,
	MaxUsd *big.Rat
}

var xyFeeTable = map[int]xyFee{
	1:     xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(40, 1)},  // Ethereum
	56:    xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(9, 10)},  // BNB
	137:   xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(9, 10)},  // Polygon
	250:   xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(9, 10)},  // Fantom
	25:    xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(9, 10)},  // Cronos
	108:   xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(9, 10)},  // ThunderCore
	43114: xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(19, 10)}, // Avalanche
	321:   xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(9, 10)},  // KCC
	42161: xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(19, 10)}, // Arbitrum
	10:    xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(19, 10)}, // Optimism
	592:   xyFee{big.NewRat(35, 1000), big.NewRat(2000, 1), big.NewRat(9, 10)},  // Astar
}

var lastFluidXySwapId libEthereum.Hash

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

	tokenAddresses_ := unpacked[6:8]

	tokenAddresses, err := ethereum.CoerceBoundContractResultsToAddresses(tokenAddresses_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce tokenAddresses to addresses! %v",
			err,
		)
	}

	var (
		// swap logs
		// fromToken is the address of tokenA
		fromToken = tokenAddresses[0]

		// toToken is the address of tokenB
		toToken = tokenAddresses[1]

		// swap topics
		// swap_id is the ID of current swap
		swap_id = transfer.Log.Topics[1]

		fromTokenIsFluid = fromToken == fluidTokenContract

		transferHasFluidToken = fromTokenIsFluid || (toToken == fluidTokenContract)
	)

	if swap_id == lastFluidXySwapId {
		log.App(func(k *log.Log) {
			k.Format(
				"Already processed XY swap in transaction %#v with swap_id %v - skipping!",
				transfer.Transaction.Hash.String(),
				swap_id,
			)
		})

		return nil, nil
	}

	if !transferHasFluidToken {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a XY swap in transaction %#v not involving the fluid token - skipping!",
				transfer.Transaction.Hash.String(),
				swap_id,
			)
		})

		return nil, nil
	}

	// We process the Fluid swap, so update lastProcessedSwapId
	lastFluidXySwapId = swap_id

	// XY only takes fees if swap is crosschain
	// Crosschain swaps can be inferred to occur if the swap is the last emitted
	// SourceChainSwap with swap_id in the TX
	txHash_ := string(transfer.Transaction.Hash)
	txHash := ethCommon.HexToHash(txHash_)

	// Get all logs in transaction
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

	if sourceChainSwapLogTxIndex == len(txLogs) {
		return nil, fmt.Errorf(
			"failed to find matching log from txHash (%v) at Index (%v)! %v",
			txHash.String(),
			sourceChainSwapLogTxIndex,
			err,
		)
	}

	// Current swap is last log, so no crosschain interaction
	if sourceChainSwapLogTxIndex == len(txLogs)-1 {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a XY swap in transaction %#v with no fees - skipping!",
				transfer.Transaction.Hash.String(),
				swap_id,
			)
		})

		return nil, nil
	}

	var (
		// Hash of SourceChainSwap log
		sourceChainSwapLogHash = transfer.Log.Topics[0]

		// Default to no SourceChainSwap log found after current SourceChainSwap
		nextSourceChainSwapLogTxIndex = -1

		// Hash of TargetChainSwap log
		targetChainSwapLogHash = libEthereum.HashFromString(targetChainSwapLogTopic)

		// Default to no TargetChainSwap log found after current SourceChainSwap
		firstTargetChainSwapLogTxIndex = -1
	)

	// Search through remaining logs to find first TargetChainSwap, and
	// next SourceChainSwap with the same swap_id
	for txIndex, txLog := range txLogs[sourceChainSwapLogTxIndex+1:] {
		hashTopic := libEthereum.HashFromString(txLog.Topics[0].String())

		hashIsSourceChainSwap := hashTopic == sourceChainSwapLogHash
		hashIsXYSwap := hashIsSourceChainSwap || (hashTopic == targetChainSwapLogHash)

		if !hashIsXYSwap {
			continue
		}

		swap_id_ := txLog.Topics[1].String()
		swap_id = libEthereum.HashFromString(swap_id_)

		// Found XY swap with different swap ID
		// Means current swap has ended with no fees
		if swap_id != lastFluidXySwapId {
			break
		}

		switch hashIsSourceChainSwap {
		case true:
			nextSourceChainSwapLogTxIndex = txIndex
		case false:
			firstTargetChainSwapLogTxIndex = txIndex
		}

		// Found either next SourceChainSwap, or first TargetChainSwap
		break
	}

	// Did not find Fluid crosschain swap, so no XY fees
	if (nextSourceChainSwapLogTxIndex > 0) || (firstTargetChainSwapLogTxIndex == 0) {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a XY swap in transaction %#v with no fees - skipping!",
				transfer.Transaction.Hash.String(),
				swap_id,
			)
		})

		return nil, nil
	}

	targetChainSwapTransferLog := txLogs[firstTargetChainSwapLogTxIndex]

	// TargetChainSwap contains the target chain ID, which is used to devive fee params
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

	if fromTokenAddress == libEthereum.AddressFromString(etherumTokenAddress) {
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

	tokenSymbol, coerced := symbol_[0].(string)

	if coerced == false {
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
