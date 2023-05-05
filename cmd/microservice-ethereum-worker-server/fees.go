package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	commonEth "github.com/fluidity-money/fluidity-app/common/ethereum"
)

// calculateLegacyFeeTransactionFee using the transaction given with the
// eth price in usd (ie $2123) and the ethereum decimals (ie 1e18)
func calculateLegacyFeeTransactionFee(emission *worker.Emission, transaction ethereum.Transaction, receipt ethereum.Receipt, ethPriceUsd, ethereumDecimalsRat *big.Rat) *big.Rat {
	// Gas units (limit) * Gas price per unit i.e 21,000 * 200 = 4,200,000 gwei or 0.0042
	var (
		gasUsed = receipt.GasUsed
		gasPrice = transaction.GasPrice
	)

	// not likely that the gas limit will go past uint64

	emission.GasUsed = gasUsed

	emission.GasPrice = gasPrice

	gasPaid := bigIntToRat(gasUsed)

	gasPaid.Mul(gasPaid, bigIntToRat(gasPrice))

	price := weiToUsd(gasPaid, ethPriceUsd, ethereumDecimalsRat)

	return price
}

func calculateDynamicFeeTransactionFee(emission *worker.Emission, transaction ethereum.Transaction, receipt ethereum.Receipt, blockBaseFee misc.BigInt, ethPriceUsd, ethereumDecimalsRat *big.Rat) *big.Rat {
	var (
		maxFeePerGas         = transaction.GasFeeCap
		maxPriorityFeePerGas = transaction.GasTipCap

		gasUsed = receipt.GasUsed
	)

	var (
		gasTipCapRat = bigIntToRat(maxPriorityFeePerGas)
		gasUsedRat   = bigIntToRat(gasUsed)
	)

	// remember the gas limit and tip cap in the
	// database for comparison later - NOTE that
	// only the gas used is used

	emission.GasTipCap = maxPriorityFeePerGas

	// remember the inputs to the gas actually used
	// in usd calculation

	emission.GasUsed = gasUsed

	emission.BlockBaseFee = blockBaseFee

	emission.MaxPriorityFeePerGas = maxPriorityFeePerGas

	// and normalise the gas tip cap by multiplying
	// ethereum decimals then converting to USD

	normalisedGasTipCapRat := weiToUsd(
		gasTipCapRat,
		ethPriceUsd,
		ethereumDecimalsRat,
	)

	emission.GasTipCapNormal, _ = normalisedGasTipCapRat.Float64()

	// normalise the block base fee by dividing it
	// by the decimals and then multiplying it by usd

	blockBaseFeeRat := new(big.Rat).SetInt(&blockBaseFee.Int)

	normalisedBlockBaseFeePerGasRat := weiToUsd(
		blockBaseFeeRat,
		ethPriceUsd,
		ethereumDecimalsRat,
	)

	emission.BlockBaseFeeNormal, _ = normalisedBlockBaseFeePerGasRat.Float64()

	maxPriorityFeePerGasRat := new(big.Rat).SetInt(&maxPriorityFeePerGas.Int)

	maxFeePerGasRat := new(big.Rat).SetInt(&maxFeePerGas.Int)

	// calculate the effective gas price (all values in wei)

	effectiveGasPrice := commonEth.CalculateEffectiveGasPrice(
		blockBaseFeeRat,
		maxFeePerGasRat,
		maxPriorityFeePerGasRat,
	)

	normalisedEffectiveGasPriceRat := weiToUsd(
		effectiveGasPrice,
		ethPriceUsd,
		ethereumDecimalsRat,
	)

	emission.EffectiveGasPriceNormal, _ = normalisedEffectiveGasPriceRat.Float64()

	// calculate the transfer fee usd, by multiplying
	// the gas used by the effective gas price

	transactionFeeNormal := new(big.Rat).Mul(
		gasUsedRat,
		normalisedEffectiveGasPriceRat,
	)

	return transactionFeeNormal
}
