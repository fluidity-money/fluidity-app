package xy_finance

import (
	"fmt"
	"math"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/state"
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

var xyFinanceAbi ethAbi.ABI

const xyFinanceRedisKey = `FLU_INTEGRATIONS_ETHEREUM_XYFINANCE`

type xyFee = struct {
	Rate   *big.Rat
	MinUsd *big.Rat
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

// GetxyFinanceSwapFees calculates fees from Swapping TokenA and TokenB performed by a pool's exchange()
// All tokens in a pool are stable relative to each other, so slippage and token exchange rates are negligible
func GetXyFinanceSwapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	unpacked, err := xyFinanceAbi.Unpack("TokenExchange", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack TokenExchange log data! %v",
			err,
		)
	}

	expectedUnpackedLen := 4
	if len(unpacked) != expectedUnpackedLen {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected %v, got %v",
			expectedUnpackedLen,
			len(unpacked),
		)
	}

	tokenExchangeData, err := ethereum.CoerceBoundContractResultsToRats(unpacked)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	var (
		// swap logs
		// sold_id is the ID (argument of coins) of tokenA
		sold_id = tokenExchangeData[0]
		// tokens_sold is the amount of sold_id transferred
		tokens_sold = tokenExchangeData[1]
		// bought_id is the ID (argument of coins) of tokenA
		bought_id = tokenExchangeData[2]
		// tokens_sold is the amount of sold_id transferred
		tokens_bought = tokenExchangeData[3]

		// swap topics
		swap_id = transfer.Log.Topics[1]
	)

	contractAddress_ := transfer.Log.Address.String()
	contractAddress := ethCommon.HexToAddress(contractAddress_)

	// Get address of src token
	soldCoinAddress_, err := ethereum.StaticCall(client, contractAddress, xyFinanceAbi, "coins", sold_id.Num())

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get sold coins address! %v",
			err,
		)
	}

	soldCoinAddress, err := ethereum.CoerceBoundContractResultsToAddress(soldCoinAddress_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce %v to address! %v",
			soldCoinAddress_,
			err,
		)
	}

	soldTokenIsFluid := soldCoinAddress == fluidTokenContract

	// Get address of dst token
	boughtCoinAddress_, err := ethereum.StaticCall(client, contractAddress, xyFinanceAbi, "coins", bought_id.Num())

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get bought coin address! %v",
			err,
		)
	}

	boughtCoinAddress, err := ethereum.CoerceBoundContractResultsToAddress(boughtCoinAddress_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce %v to address! %v",
			boughtCoinAddress_,
			err,
		)
	}

	swapContainsFluid := soldTokenIsFluid || (boughtCoinAddress == fluidTokenContract)

	// TokenExchange does not contain Fluid Transfer
	if !swapContainsFluid {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a xyFinance swap in transaction %#v not involving the fluid token - skipping!",
				transfer.Transaction.Hash.String(),
			)
		})

		return nil, nil
	}

	// Get current fee rate
	xyFinanceFeeNum_, err := ethereum.StaticCall(
		client,
		contractAddress,
		xyFinanceAbi,
		"fee",
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to retrieve fees! %v",
			err,
		)
	}

	xyFinanceFeeNum, err := ethereum.CoerceBoundContractResultsToRat(xyFinanceFeeNum_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce %v to rat! %v",
			xyFinanceFeeNum_,
			err,
		)
	}

	// adjust fee rate by xyFinance's hardcoded fee decimals
	feeDecimalsAdjusted := math.Pow10(xyFinanceFeeDecimals)
	decimalsRat := new(big.Rat).SetFloat64(feeDecimalsAdjusted)

	xyFinanceFeeRate := new(big.Rat).Quo(xyFinanceFeeNum, decimalsRat)

	fluidFee := calculateXyFinanceSwapFee(
		tokens_sold,
		tokens_bought,
	)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat = new(big.Rat).SetFloat64(decimalsAdjusted)

	fluidFee.Quo(fluidFee, decimalsRat)

	return fluidFee, nil
}

// calculateXySwapFee takes 0.1% per transaction of stable-coins, with a minimum fee of $40,
// and maximum fee of $1000. Given Fluid tokens are stable coins, we calculate 0.1% of amount, adjust
// for decimals, and clamp it between $40 and $1000
func calculateXyFinanceSwapFee(amount, decimalsRat *big.Rat) *big.Rat {
	// 0.1%
	feeRate := big.NewRat(35, 10000)

	// amount * 0.1%
	feeAmount := new(big.Rat).Mul(amount, feeRate)

	// $(amount * 0.1%) USD
	feeAmountUsd := new(big.Rat).Quo(feeAmount, decimalsRat)

	// $40
	minFee := big.NewRat(40, 1)

	// $1000
	maxFee := big.NewRat(1000, 1)

	switch true {
	// feeAmountUsd < minFee -> minFee
	case feeAmountUsd.Cmp(minFee) < 0:
		return minFee

	// feeAmountUsd > maxFee -> maxFee
	case feeAmountUsd.Cmp(maxFee) > 0:
		return maxFee

	// 40 <= fee <= 1000 -> fee
	default:
		return feeAmountUsd
	}
}
