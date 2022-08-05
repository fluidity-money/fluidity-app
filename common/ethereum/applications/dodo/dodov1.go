package dodo

// https://docs.dodoex.io/english/developers/contract-data/contract-event

import (
	"context"
	"fmt"
	"math"
	"math/big"
	"sort"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const DodoV1SwapAbiString = `[
]`

var dodoV1SwapAbi ethAbi.ABI

// GetFixedRateSwapFees calculates fees from Swapping TokenA and TokenB performed by FixedRateSwap
// Because TokenA and TokenB are required to have the same decimals, the fee is the value that
// balances x TokenA + y TokenB + fee = const
func GetDodoV1Fees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	unpacked, err := dodoV1SwapAbi.Unpack("DODOSwap", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 6 {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected %v, got %v",
			6,
			len(unpacked),
		)
	}

	swapAmounts_ := unpacked[2:4]

	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(swapAmounts_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	var (
		// swap logs
		// fromToken is the address of tokenA
		toToken = ethCommon.HexToAddress(unpacked[1].(string))

		// fromAmount is the amount of tokenA swapped
		fromAmount = swapAmounts[0]

		// toAmount is the amount of tokenB swapped
		toAmount = swapAmounts[1]

		// swap topics
		// receiver is the message sender
		receiver = ethCommon.HexToHash(transfer.Log.Topics[5].String())

		// whether the token being swapped to is the fluid token
		toTokenIsFluid = toToken == fluidTokenContract
	)

	// Find lpFeeRate via call to contract
	contractAddress_ := transfer.Log.Address.String()
	contractAddress := ethCommon.HexToAddress(contractAddress_)

	method := "_LP_FEE_RATE_"
	lpFeeRate_, err := ethereum.StaticCall(client, contractAddress, dodoV1SwapAbi, method)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to fetch %v from %v! %v",
			method,
			contractAddress.String(),
			err,
		)
	}

	lpFeeRate, err := ethereum.CoerceBoundContractResultsToRat(lpFeeRate_)

	// Dodo hardcodes denom as 10**18
	dodoFeeDecimals := 18
	dodoDecimalsAdjusted := math.Pow10(dodoFeeDecimals)
	dodoDecimalsRat := big.NewRat(int64(dodoDecimalsAdjusted), 1)

	lpFeeRate.Quo(lpFeeRate, dodoDecimalsRat)

	// Find mtBaseTokenFee by taking last log. If last log was a transfer to
	// the sender, mtBaseTokenFee is 0
	txHash := ethCommon.HexToHash(string(transfer.Transaction.Hash))

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
	swapLogBlockIndex := uint(transfer.Log.Index.Uint64())

	swapLogTxIndex := sort.Search(len(txLogs), func(i int) bool {
		// txLogs.Index sorted in ascending order, so use >= op
		return swapLogBlockIndex >= txLogs[i].Index
	})

	if swapLogTxIndex == len(txLogs) {
		return nil, fmt.Errorf(
			"failed to find matching log from txHash (%v) at Index (%v)! %v",
			txHash.String(),
			swapLogBlockIndex,
			err,
		)
	}

	if swapLogTxIndex == 0 {
		return nil, fmt.Errorf(
			"found index too small to find matching transfer for DODO (%v)! %v",
			txHash,
			err,
		)
	}

	// prevTransferLog is a transfer either to the receiver, or maintainer.
	// If there are no mtFees, the prev log will be to the receiver
	prevTransferLog := txLogs[swapLogTxIndex-1]

	// Default mtFees to 0
	mtToTokenFee := big.NewRat(0, 1)

	if prevTransferLog.Topics[2] != receiver {
		// last transfer were mtFees, update mtFee amount
		unpacked, err = erc20Abi.Unpack("Transfer", prevTransferLog.Data)

		if err != nil {
			return nil, fmt.Errorf(
				"Failed to unpack transfer log data! %v",
				err,
			)
		}

		if len(unpacked) != 1 {
			return nil, fmt.Errorf(
				"Unpacked the wrong number of values! Expected %v, got %v",
				1,
				len(unpacked),
			)
		}

		mtToTokenFee, err = ethereum.CoerceBoundContractResultsToRat(unpacked)

		if err != nil {
			return nil, fmt.Errorf(
				"Failed to coerce transfer log data to rat! %v",
				err,
			)
		}
	}

	fluidFee := calculateDodoV1Fee(fromAmount, toAmount, lpFeeRate, mtToTokenFee, toTokenIsFluid)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fluidFee.Quo(fluidFee, decimalsRat)

	return fluidFee, nil
}

// DODO calculates fees via dynamic maintenance (mt) and static (lp) fees
// All calculations are wrapped in toToken
//     getQuote(fromAmount) -> quote - (quote * lpRate) - mtFee -> toAmount
//
// calculateDodoFee performs the reverse operation to get total toTokenFee
//     toAmount + mtFee -> mtAdjustedAmt / (1 - lpRate) -> getQuote(fromAmount)
//
// If necessary, calculateDodoFee will approximate the conversion from toTokenFee to fromTokenFee
func calculateDodoV1Fee(fromAmount, toAmount, lpFeeRate, mtToTokenFee *big.Rat, toTokenIsFluid bool) *big.Rat {
	mtAdjustedToAmount := new(big.Rat).Add(toAmount, mtToTokenFee)

	// reverseLpFeeRate = (1 - lpRate)
	reverseLpFeeRate := new(big.Rat).Sub(big.NewRat(1, 1), lpFeeRate)

	// toTokenQuote is equivalent to fromAmount, ignoring slippage from getQuote
	toTokenQuote := new(big.Rat).Quo(mtAdjustedToAmount, reverseLpFeeRate)

	lpToTokenFee := new(big.Rat).Sub(toTokenQuote, mtAdjustedToAmount)

	totalToTokenFee := new(big.Rat).Add(lpToTokenFee, mtToTokenFee)

	if toTokenIsFluid {
		return totalToTokenFee
	}

	toTokenToFromTokenRatio := new(big.Rat).Quo(fromAmount, toTokenQuote)

	totalFromTokenFee := new(big.Rat).Mul(totalToTokenFee, toTokenToFromTokenRatio)

	return totalFromTokenFee
}
