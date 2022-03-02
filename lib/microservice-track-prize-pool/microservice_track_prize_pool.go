package microservice_track_prize_pool

// microservice_track_prize_pool queries the smart contract to get the
// current prize pool amount.

import (
	"context"
	"fmt"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

// NetworkName to use to refer to the codebase internally.
const NetworkName = "ethereum"

const rewardPoolAbiString = `
    [
        {
          "constant": false,
          "inputs": [],
          "name": "rewardPoolAmount",
          "outputs": [ { "name": "", "type": "uint256" } ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }
    ]
`

// FluidityContract contains the parsed ABI definition of the Fluidity
// contract
type FluidityContract struct {
	boundContract      *ethBind.BoundContract
	contractAddress    ethCommon.Address
	contractAddressHex string
}

var rewardPoolAbi ethAbi.ABI

// NewFluidityContract that is constructed by taking Fluidity's hex address,
// a reader for the ABI and a client to use to connect to Geth.
func NewFluidityContract(fluidityHexAddress string, gethClient *ethclient.Client) (*FluidityContract, error) {

	fluidityAddress := ethCommon.HexToAddress(fluidityHexAddress)

	boundContract := ethBind.NewBoundContract(
		fluidityAddress,
		rewardPoolAbi,
		gethClient,
		gethClient,
		gethClient,
	)

	fluidityContract := FluidityContract{
		boundContract:      boundContract,
		contractAddress:    fluidityAddress,
		contractAddressHex: fluidityHexAddress,
	}

	return &fluidityContract, nil
}

// GetPrizePool of the smart contract by querying Geth and the function
// rewardPoolAmount in the smart contract.
func (contract FluidityContract) GetPrizePool() (*big.Int, error) {
	opts := ethBind.CallOpts{
		Pending: false,
		Context: context.Background(),
	}

	var results []interface{}

	err := contract.boundContract.Call(
		&opts,
		&results,
		"rewardPoolAmount",
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to call a bound Fluidity contract! %v",
			err,
		)
	}

	if len(results) != 1 {
		return nil, fmt.Errorf(
			"Failed to call a Fluidity contract to get the rewardPoolAmount! %v",
			err,
		)
	}

	var amount *big.Int

	switch results[0].(type) {
	case *big.Int:
		amount = results[0].(*big.Int)

	default:
		return nil, fmt.Errorf(
			"Failed to coerce rewardPoolAmount to a *big.Int! %v",
			err,
		)
	}

	if amount == nil {
		return nil, fmt.Errorf(
			"big.Int returned from rewardPoolAmount was empty! %v",
			err,
		)
	}

	return amount, nil
}

// GetContractAddress that was set during the contract's construction
func (contract FluidityContract) GetContractAddress() string {
	return contract.contractAddressHex
}

