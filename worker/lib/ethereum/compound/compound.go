package compound

import (
	"context"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/worker/lib/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log/breadcrumb"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const cTokenContractAbiString = `[
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOfUnderlying",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x3af9e669"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "supplyRatePerBlock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xae9d70b0"
    }
]`

// cTokenContractAbi set by init.go to contain the CToken ABI code that
// can be used with a bound contract
var cTokenContractAbi ethAbi.ABI

// GetBalanceOfUnderlying using a ctoken contract!
func GetBalanceOfUnderlying(client *ethclient.Client, cTokenAddress, contractAddress ethCommon.Address) (*big.Rat, error) {

	boundContract := ethBind.NewBoundContract(
		cTokenAddress,
		cTokenContractAbi,
		client,
		client,
		client,
	)

	opts := ethBind.CallOpts{
		Pending: false,
		Context: context.Background(),
	}

	var results []interface{}

	err := boundContract.Call(
		&opts,
		&results,
		"balanceOfUnderlying",
		contractAddress,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to call a bound Compound ctoken contract to get balanceOfUnderlying! %v",
			err,
		)
	}

	if resultsLen := len(results); resultsLen != 1 {
		return nil, fmt.Errorf(
			"results didn't contain the length expected (was %#v, not 1)!",
			resultsLen,
		)
	}

	amountRat, err := ethereum.CoerceBoundContractResultsToRat(results)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce results data from cToken to a Rat! %v",
			err,
		)
	}

	return amountRat, nil
}

// GetTokenApy, following the algorithm described in Compound's
// documentation
func GetTokenApy(client *ethclient.Client, cTokenAddress ethCommon.Address, blocksPerDay uint64, crumb *breadcrumb.Breadcrumb) (*big.Rat, error) {

	boundContract := ethBind.NewBoundContract(
		cTokenAddress,
		cTokenContractAbi,
		client,
		client,
		client,
	)

	opts := ethBind.CallOpts{
		Pending: false,
		Context: context.Background(),
	}

	var results []interface{}

	err := boundContract.Call(
		&opts,
		&results,
		"supplyRatePerBlock",
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get the supply rate per block for ctoken! %v",
			err,
		)
	}

	supplyRatePerBlockRat, err := ethereum.CoerceBoundContractResultsToRat(results)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce the supply rate per block for the ctoken! %v",
			err,
		)
	}

	ethMantissa := big.NewRat(1e18, 1)

	blocksPerDayRat := new(big.Rat).SetUint64(blocksPerDay)

	daysPerYear := 365

	supplyRatePerBlockDivEthMantissa := new(big.Rat).Quo(supplyRatePerBlockRat, ethMantissa)

	supplyRatePerBlockMulBlocksPerDay := new(big.Rat).Mul(
		supplyRatePerBlockDivEthMantissa,
		blocksPerDayRat,
	)

	oneRat := big.NewRat(1, 1)

	powLeftSide := new(big.Rat).Add(supplyRatePerBlockMulBlocksPerDay, oneRat)

	powLeftSideDaysPerYear := ethereum.BigPow(powLeftSide, daysPerYear)

	powLeftSideDaysPerYearMinOne := new(big.Rat).Sub(powLeftSideDaysPerYear, oneRat)

	supplyApy := new(big.Rat).Mul(powLeftSideDaysPerYearMinOne, big.NewRat(100, 1))

	crumb.Set(func(k *breadcrumb.Breadcrumb) {
		k.Many(map[string]interface{}{
			"blocks per day":                           blocksPerDay,
			"supply rate per block div eth mantissa":   supplyRatePerBlockDivEthMantissa.FloatString(10),
			"supply rate per block mul blocks per day": supplyRatePerBlockMulBlocksPerDay.FloatString(10),
			"pow left side":                            powLeftSide.FloatString(10),
			"pow left side days per year":              powLeftSideDaysPerYear.FloatString(10),
			"supply apy":                               supplyApy.FloatString(10),
		})
	})

	return supplyApy, nil
}
