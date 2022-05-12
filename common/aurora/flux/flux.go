package flux

import (
	"context"
	"fmt"
	"math"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
)

const fluxContractAbiString = `[
	{
		"inputs": [],
		"name": "latestAnswer",
		"outputs": [
		  { "internalType": "int256", "name": "", "type": "int256" }
		],
		"stateMutability": "view",
		"type":"function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
	  	  { "internalType": "uint8", "name": "", "type": "uint8" }
		],
		"stateMutability": "view",
		"type": "function"
	}
]`

// fluxContractAbi set by init.go to generate the ABI code
var fluxContractAbi ethAbi.ABI

func GetPrice(client *ethclient.Client, fluxContractAddress ethCommon.Address) (*big.Rat, error) {
	boundContract := ethAbiBind.NewBoundContract(
		fluxContractAddress,
		fluxContractAbi,
		client,
		client,
		client,
	)

	opts := ethAbiBind.CallOpts{
		Pending: false,
		Context: context.Background(),
	}

	var results []interface{}

	err := boundContract.Call(
		&opts,
		&results,
		"latestAnswer",
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to call the latestAnswer (price) function on Flux's price feed at %#v! %v",
			fluxContractAddress,
			err,
		)
	}

	amountRat, err := ethereum.CoerceBoundContractResultsToRat(results)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce the results from the Flux feed latestAnswer (price) function to rat! %v",
			err,
		)
	}

	return amountRat, nil
}

// GetDecimals for the oracle price, that may differ from the actual token
func GetDecimals(client *ethclient.Client, fluxContractAddress ethCommon.Address) (*big.Rat, error) {
	boundContract := ethAbiBind.NewBoundContract(
		fluxContractAddress,
		fluxContractAbi,
		client,
		client,
		client,
	)

	opts := ethAbiBind.CallOpts{
		Pending: false,
		Context: context.Background(),
	}

	var results []interface{}

	err := boundContract.Call(
		&opts,
		&results,
		"decimals",
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to call the decimals function on Flux's price feed at %#v! %v",
			fluxContractAddress,
			err,
		)
	}

	if len(results) != 1 {
		return nil, fmt.Errorf(
			"expected one value for Flux price decimals, got %v!",
			len(results),
		)
	}

	decimalsUint8, err := ethereum.CoerceBoundContractResultsToUint8(results)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce the results from the Flux feed decimals function to uint8! %v",
			err,
		)
	}

	// set to 10^decimals
	decimalsAdjusted := math.Pow10(int(decimalsUint8))

	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	return decimalsRat, nil
}
