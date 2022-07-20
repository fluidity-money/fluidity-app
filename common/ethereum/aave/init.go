package aave

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	addressProviderReader := strings.NewReader(aaveLendingPoolAddressProviderAbiString)

	var err error

	if addressProviderAbi, err = ethAbi.JSON(addressProviderReader); err != nil {
		panic(err)
	}

	aTokenReader := strings.NewReader(aaveATokenAbiString)

	if aTokenAbi, err = ethAbi.JSON(aTokenReader); err != nil {
		panic(err)
	}

	priceOracleAbiReader := strings.NewReader(aavePriceOracleAbiString)

	if priceOracleAbi, err = ethAbi.JSON(priceOracleAbiReader); err != nil {
		panic(err)
	}

	lendingPoolAbiReader := strings.NewReader(aaveLendingPoolAbiString)

	if lendingPoolAbi, err = ethAbi.JSON(lendingPoolAbiReader); err != nil {
		panic(err)
	}
}
