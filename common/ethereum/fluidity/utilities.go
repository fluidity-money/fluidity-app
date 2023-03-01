package fluidity

import (
	"context"
	"math/big"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

type (
	utilityVars struct {
		PoolSizeNative    *big.Int `abi:"poolSizeNative"`
		TokenDecimalScale *big.Int `abi:"tokenDecimalScale"`
		ExchangeRateNum   *big.Int `abi:"exchangeRateNum"`
		ExchangeRateDenom *big.Int `abi:"exchangeRateDenom"`
		DeltaWeightNum    *big.Int `abi:"deltaWeightNum"`
		DeltaWeightDenom  *big.Int `abi:"deltaWeightDenom"`
	}
	scannedUtilityVar struct {
		Vars  utilityVars `abi:"vars"`
		Name  string      `abi:"name"`
	}
)

// GetUtilityVars from a list of utilities, returning if any failed
func GetUtilityVars(client *ethclient.Client, registryAddress, tokenAddress ethCommon.Address, fluidityClients []applications.UtilityName, defaultDeltaWeightNum, defaultDeltaWeightDenom *big.Int) ([]worker.UtilityVars, error) {
	boundContract := ethAbiBind.NewBoundContract(
		registryAddress,
		RegistryAbi,
		client,
		client,
		client,
	)

	opts := ethAbiBind.CallOpts{
		Pending: false,
		Context: context.Background(),
	}

	var utilityVar []scannedUtilityVar
	results := []interface{} { &utilityVar }

	err := boundContract.Call(
		&opts,
		&results,
		"getUtilityVars",
		tokenAddress,
		fluidityClients,
	)

	if err != nil {
		return nil, err
	}

	scannedVars := *results[0].(*[]scannedUtilityVar)

	var vars []worker.UtilityVars

	for _, scanned := range scannedVars {
		var (
			scannedVars = scanned.Vars
			// this cast is valid since it's passed straight through from fluidityClients
			name = applications.UtilityName(scanned.Name)

			poolSizeNative    = scannedVars.PoolSizeNative
			tokenDecimalScale = scannedVars.TokenDecimalScale
			exchangeRateNum   = scannedVars.ExchangeRateNum
			exchangeRateDenom = scannedVars.ExchangeRateDenom
			deltaWeightNum    = scannedVars.DeltaWeightNum
			deltaWeightDenom  = scannedVars.DeltaWeightDenom
		)

		poolSizeNativeRat := new(big.Rat).SetInt(poolSizeNative)

		tokenDecimalScaleRat := new(big.Rat).SetInt(tokenDecimalScale)

		exchangeRateRat := new(big.Rat)
		exchangeRateRat.Num().Set(exchangeRateNum)
		exchangeRateRat.Denom().Set(exchangeRateDenom)

		deltaWeightRat := new(big.Rat)
		deltaWeightRat.Num().Set(deltaWeightNum)
		deltaWeightRat.Denom().Set(deltaWeightDenom)

		utilityVar := worker.UtilityVars{
			Name:               name,
			PoolSizeNative:     poolSizeNativeRat,
			TokenDecimalsScale: tokenDecimalScaleRat,
			ExchangeRate:       exchangeRateRat,
			DeltaWeight:        deltaWeightRat,
		}

		vars = append(vars, utilityVar)
	}

	return vars, nil
}
