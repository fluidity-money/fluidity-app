// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package aave

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const aaveLendingPoolAddressProviderAbiString = `[
    {
      "inputs": [],
      "name": "getPriceOracle",
      "outputs": [
		  {
			  "internalType": "address",
			  "name": "",
			  "type": "address"

		  }
	  ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLendingPool",
      "outputs": [
		  {
			  "internalType": "address",
			  "name": "",
			  "type": "address"

		  }
	  ],
      "stateMutability": "view",
      "type": "function"
    }
]`

const aaveLendingPoolAbiString = `[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "asset",
				"type": "address"
			}
		],
		"name": "getReserveData",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "configuration",
				"type": "uint256"
			},
			{
				"internalType": "uint128",
				"name": "liquidityIndex",
				"type": "uint128"
			},
			{
				"internalType": "uint128",
				"name": "variableBorrowIndex",
				"type": "uint128"
			},
			{
				"internalType": "uint128",
				"name": "currentLiquidityRate",
				"type": "uint128"
			},
			{
				"internalType": "uint128",
				"name": "currentVariableBorrowRate",
				"type": "uint128"
			},
			{
				"internalType": "uint128",
				"name": "currentStableBorrowRate",
				"type": "uint128"
			},
			{
				"internalType": "uint40",
				"name": "lastUpdateTimestamp",
				"type": "uint40"
			},
			{
				"internalType": "address",
				"name": "aTokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "stableDebtTokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "variableDebtTokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "interestRateStrategyAddress",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "id",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`

const aaveATokenAbiString = `[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`

const aavePriceOracleAbiString = `[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_asset",
				"type": "address"
			}
		],
		"name": "getAssetPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`

// addressProviderAbi set by init.go to contain the aave address provider
// ABI code that can be used with a bound contract
var addressProviderAbi ethAbi.ABI

// aTokenAbi set by init.go to contain the aave address provider
// ABI code that can be used with a bound contract
var aTokenAbi ethAbi.ABI

// priceOracleAbi set by init.go to contain the aave price oracle
// ABI code that can be used with a bound contract
var priceOracleAbi ethAbi.ABI

// lendingPoolAbi set by init.go to contain the aave lending pool
// ABI code that can be used with a bound contract
var lendingPoolAbi ethAbi.ABI

// GetBalanceOf using an atoken contract gets the user's current balance,
// accounting for interest
func GetBalanceOf(client *ethclient.Client, aTokenAddress, contractAddress ethCommon.Address) (*big.Rat, error) {
	results, err := ethereum.StaticCall(
		client,
		aTokenAddress,
		aTokenAbi,
		"balanceOf",
		contractAddress,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to call a bound aave atoken contract to get balanceOf! %v",
			err,
		)
	}

	amountRat, err := ethereum.CoerceBoundContractResultsToRat(results)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce results data from aToken to a Rat! %v",
			err,
		)
	}

	return amountRat, nil
}

func getAaveAddress(client *ethclient.Client, addressProvider ethCommon.Address, method string) (ethCommon.Address, error) {
	var address ethCommon.Address

	results, err := ethereum.StaticCall(
		client,
		addressProvider,
		addressProviderAbi,
		method,
	)

	if err != nil {
		return address, fmt.Errorf(
			"failed to call a bound aave addressprovider contract with method %s! %w",
			method,
			err,
		)
	}

	address, err = ethereum.CoerceBoundContractResultsToAddress(results)

	if err != nil {
		return address, fmt.Errorf(
			"failed to coerce results data from addressprovider to an address! %w",
			err,
		)
	}

	return address, nil
}

// GetPrice returns the price of an asset in USD
func GetPrice(client *ethclient.Client, addressProvider ethCommon.Address, token, usdToken ethCommon.Address) (*big.Rat, error) {
	priceOracle, err := getAaveAddress(client, addressProvider, "getPriceOracle")

	if err != nil {
		return nil, fmt.Errorf(
			"failed to look up the current aave price oracle! %w",
			err,
		)
	}

	// aave's oracles return the prices in eth, so we divide that by
	// their price for USD to get the price of the asset in USD
	usdPriceResult, err := ethereum.StaticCall(
		client,
		priceOracle,
		priceOracleAbi,
		"getAssetPrice",
		usdToken,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to fetch usd price from the aave price oracle! %w",
			err,
		)
	}

	usdPriceEth, err := ethereum.CoerceBoundContractResultsToRat(usdPriceResult)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to read a rat from the aave usd price oracle! %w",
			err,
		)
	}

	priceResults, err := ethereum.StaticCall(
		client,
		priceOracle,
		priceOracleAbi,
		"getAssetPrice",
		token,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to fetch asset price from the aave price oracle! %w",
			err,
		)
	}

	assetPriceEth, err := ethereum.CoerceBoundContractResultsToRat(priceResults)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to read a rat from the price oracle's results! %w",
			err,
		)
	}

	isAssetPriceZero := big.NewRat(0, 1).Cmp(assetPriceEth) == 0

	if isAssetPriceZero {
		return nil, fmt.Errorf(
			"asset price at AddressProvider %v, token address %v is 0!",
			addressProvider,
			token,
		)
	}

	assetPriceUsd := safeQuo(assetPriceEth, usdPriceEth)

	return assetPriceUsd, nil
}

func GetTokenApy(client *ethclient.Client, addressProvider, underlying ethCommon.Address, emission *worker.Emission) (*big.Rat, error) {
	lendingPool, err := getAaveAddress(client, addressProvider, "getLendingPool")

	if err != nil {
		return nil, fmt.Errorf(
			"failed to look up the current aave lending pool! %w",
			err,
		)
	}

	reserveResults, err := ethereum.StaticCall(
		client,
		lendingPool,
		lendingPoolAbi,
		"getReserveData",
		underlying,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get aave reserve data! %w",
			err,
		)
	}

	liquidityRateResult, ok := reserveResults[3].(*big.Int)

	if !ok {
		return nil, fmt.Errorf("could not read liquidity rate as a uint128!")
	}

	liquidityRate := new(big.Rat).SetInt(liquidityRateResult)

	// aave returns things scaled by rays, which are 10**27

	aaveMantissaInt := new(big.Int).Exp(big.NewInt(10), big.NewInt(27), nil)

	aaveMantissa := new(big.Rat).SetInt(aaveMantissaInt)

	// the aave docs say to use seconds per year for this, which with our
	// bigpow implementation takes too long and doesn't give us meaningfully
	// more precision

	var compoundingIntervalInt int64 = 365

	compoundingInterval := big.NewRat(compoundingIntervalInt, 1)

	one := big.NewRat(1, 1)

	depositAPR := new(big.Rat).Quo(liquidityRate, aaveMantissa)

	aprPerDay := new(big.Rat).Quo(depositAPR, compoundingInterval)

	onePlusAprPerDay := new(big.Rat).Add(one, aprPerDay)

	compoundedApr := ethereum.BigPow(onePlusAprPerDay, int(compoundingIntervalInt))

	depositApy := new(big.Rat).Sub(compoundedApr, one)

	emission.AaveGetTokenApy.DepositApr, _ = depositAPR.Float64()
	emission.AaveGetTokenApy.APRPerDay, _ = aprPerDay.Float64()
	emission.AaveGetTokenApy.OnePlusAprPerDay, _ = onePlusAprPerDay.Float64()
	emission.AaveGetTokenApy.CompoundedApr, _ = compoundedApr.Float64()
	emission.AaveGetTokenApy.DepositApy, _ = depositApy.Float64()

	return depositApy, nil
}
