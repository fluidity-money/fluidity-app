package flux

import (
	"math/big"
	"fmt"
	"context"

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
