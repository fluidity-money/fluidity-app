package fluidity

import (
	"context"
	"fmt"
	"math/big"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

var trfVarNotAvailable *big.Int

func init() {
	maxUint, success := new(big.Int).SetString(
		"ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
		16,
	)

	if !success {
		panic("fluidity/registry: failed to set TrfVarNotAvailable!")
	}

	trfVarNotAvailable = maxUint
}

func anyVarsNotAvailable(args... *big.Int) bool {
	for _, arg := range args {
		if trfVarNotAvailable.Cmp(arg) == 0 {
			return true
		}
	}

	return false
}

type (
	trfVars struct {
		PoolSizeNative    *big.Int `abi:"poolSizeNative"`
		TokenDecimalScale *big.Int `abi:"tokenDecimalScale"`
		ExchangeRateNum   *big.Int `abi:"exchangeRateNum"`
		ExchangeRateDenom *big.Int `abi:"exchangeRateDenom"`
		DeltaWeightNum    *big.Int `abi:"deltaWeightNum"`
		DeltaWeightDenom  *big.Int `abi:"deltaWeightDenom"`
	}
	scannedTrfVar struct {
		Vars  trfVars `abi:"vars"`
		Found bool    `abi:"found"`
		Name  string  `abi:"name"`
	}
)

// GetTrfVars from a list of utilities, returning if any failed
func GetTrfVars(client *ethclient.Client, registryAddress, tokenAddress ethCommon.Address, fluidityClients []applications.Utility, defaultDeltaWeightNum, defaultDeltaWeightDenom *big.Int) ([]worker.PoolDetails, error, []error) {
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

	var trfVar []scannedTrfVar
	results := []interface{} { &trfVar }

	err := boundContract.Call(
		&opts,
		&results,
		"getTrfVars",
		tokenAddress,
		fluidityClients,
	)

	if err != nil {
		return nil, err, nil
	}

	scannedVars := *results[0].(*[]scannedTrfVar)

	var (
		vars []worker.PoolDetails
		poolErrors []error
	)

	for _, scanned := range scannedVars {
		var (
			scannedVars = scanned.Vars
			found = scanned.Found
			// this cast is valid since it's passed straight through from fluidityClients
			name = applications.Utility(scanned.Name)

			poolSizeNative    = scannedVars.PoolSizeNative
			tokenDecimalScale = scannedVars.TokenDecimalScale
			exchangeRateNum   = scannedVars.ExchangeRateNum
			exchangeRateDenom = scannedVars.ExchangeRateDenom
			deltaWeightNum    = scannedVars.DeltaWeightNum
			deltaWeightDenom  = scannedVars.DeltaWeightDenom
		)

		if !found {
			poolErrors = append(poolErrors, fmt.Errorf("utility %s not found!", name))
			continue
		}

		if anyVarsNotAvailable(poolSizeNative) {
			poolErrors = append(poolErrors, fmt.Errorf("for utility %s poolSizeNative not available!", name))
			continue
		}
		poolSizeNativeRat := new(big.Rat).SetInt(poolSizeNative)

		if anyVarsNotAvailable(tokenDecimalScale) {
			poolErrors = append(poolErrors, fmt.Errorf("for utility %s tokenDecimalScale not available!", name))
			continue
		}
		tokenDecimalScaleRat := new(big.Rat).SetInt(tokenDecimalScale)

		if anyVarsNotAvailable(exchangeRateNum, exchangeRateDenom) {
			poolErrors = append(poolErrors, fmt.Errorf("for utility %s exchange rate not available!", name))
			continue
		}
		exchangeRateRat := new(big.Rat)
		exchangeRateRat.Num().Set(exchangeRateNum)
		exchangeRateRat.Denom().Set(exchangeRateDenom)

		if anyVarsNotAvailable(deltaWeightNum, deltaWeightDenom) {
			deltaWeightNum.Set(defaultDeltaWeightNum)
			deltaWeightDenom.Set(defaultDeltaWeightDenom)
		}
		deltaWeightRat := new(big.Rat)
		deltaWeightRat.Num().Set(deltaWeightNum)
		deltaWeightRat.Denom().Set(deltaWeightDenom)

		trfVar := worker.PoolDetails{
			Name:           name,
			PoolSizeNative: poolSizeNativeRat,
			TokenDecimalsScale:  tokenDecimalScaleRat,
			ExchangeRate:   exchangeRateRat,
			DeltaWeight:    deltaWeightRat,
		}

		vars = append(vars, trfVar)
	}

	return vars, nil, poolErrors
}
