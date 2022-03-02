package uniswap_anchored_view

import (
	"math/big"
	"fmt"
	"context"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/ethclient"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

const uniswapContractAbiString = `[
    {
      "inputs": [
        { "internalType": "string", "name": "symbol", "type": "string" }
      ],
      "name": "price",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
]`

var uniswapContractAbi ethAbi.ABI

func GetPrice(client *ethclient.Client, uniswapAnchoredViewAddress ethCommon.Address, tokenSymbol string) (*big.Rat, error) {
	boundContract := ethAbiBind.NewBoundContract(
		uniswapAnchoredViewAddress,
		uniswapContractAbi,
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
		"price",
		tokenSymbol,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to call the price function on Uniswap's anchored view at %#v! %v",
			uniswapAnchoredViewAddress,
			err,
		)
	}

	var price *big.Int

	switch results[0].(type) {
	case *big.Int:
		price = results[0].(*big.Int)

	default:
		return nil, fmt.Errorf(
			"failed to coerce price return values to a *big.Int! %v",
			err,
		)
	}

	if price == nil {
		return nil, fmt.Errorf(
			"*big.Int returned from price was nil!",
		)
	}

	priceRat := new(big.Rat).SetInt(price)

	return priceRat, nil
}
