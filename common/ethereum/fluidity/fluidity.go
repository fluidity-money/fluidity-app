// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

import (
	"context"
	"fmt"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	typesWorker "github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const tokenContractAbiString = `[
{
	"inputs": [],
	"name": "rewardPoolAmount",
	"outputs": [
		{ "internalType": "uint256", "name": "", "type": "uint256" }
	],
	"stateMutability": "nonpayable",
	"type": "function"
},
{
	"inputs": [
		{
			"components": [
				{ "internalType": "address", "name": "winner", "type": "address" },
				{ "internalType": "uint256", "name": "winAmount", "type": "uint256" }
			],
			"internalType": "struct Winner[]",
			"name": "rewards",
			"type": "tuple[]"
		},
		{ "internalType": "uint256", "name": "firstBlock", "type": "uint256" },
		{ "internalType": "uint256", "name": "lastBlock", "type": "uint256" }
	],
	"name": "batchReward",
	"outputs": [],
	"type": "function"
},
{
	"inputs": [
		{ "internalType": "address", "name": "to", "type": "address" },
		{ "internalType": "uint256", "name": "amount", "type": "uint256" }
	],
	"name": "transfer",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
},
{
	"anonymous": false,
	"inputs": [
		{ "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
		{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
		{ "indexed": false, "internalType": "uint256", "name": "startBlock", "type": "uint256" },
		{ "indexed": false, "internalType": "uint256", "name": "endBlock", "type": "uint256" }
	],
	"name": "Reward",
	"type": "event"
},
{
	"anonymous": false,
	"inputs": [
		{ "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
		{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
		{ "indexed": false, "internalType": "uint256", "name": "startBlock", "type": "uint256" },
		{ "indexed": false, "internalType": "uint256", "name": "endBlock", "type": "uint256" }
	],
	"name": "BlockedReward",
	"type": "event"
},
{
	"anonymous": false,
	"inputs": [
		{ "indexed": true, "internalType": "bytes32", "name": "originalRewardTx", "type": "bytes32" },
		{ "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
		{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
		{ "indexed": false, "internalType": "uint256", "name": "startBlock", "type": "uint256" },
		{ "indexed": false, "internalType": "uint256", "name": "endBlock", "type": "uint256" }
	],
	"name": "UnblockReward",
	"type": "event"
},
{
	"inputs": [
		{ "internalType": "bytes32", "name": "txHash", "type": "bytes32" },
		{ "internalType": "address", "name": "from", "type": "address" },
		{ "internalType": "address", "name": "to", "type": "address" },
		{ "internalType": "uint256[]", "name": "balls", "type": "uint256[]" },
		{ "internalType": "uint256[]", "name": "payouts", "type": "uint256[]" }
	],
	"name": "reward",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
},
{
	"inputs": [
		{ "internalType": "uint256", "name": "global", "type": "uint256" },
		{ "internalType": "uint256", "name": "user", "type": "uint256" }
	],
	"name": "updateMintLimits",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
},
{
	"inputs": [
		{ "internalType": "bytes32", "name": "rewardTx", "type": "bytes32" },
		{ "internalType": "address", "name": "user", "type": "address" },
		{ "internalType": "uint256", "name": "amount", "type": "uint256" },
		{ "internalType": "bool", "name": "payout", "type": "bool" },
		{ "internalType": "uint256", "name": "firstBlock", "type": "uint256" },
		{ "internalType": "uint256", "name": "lastBlock", "type": "uint256" }
	],
	"name": "unblockReward",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
},
{
	"anonymous": false,
	"inputs": [
		{ "indexed": true, "internalType": "address", "name": "addr", "type": "address" },
		{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
	],
	"name": "BurnFluid",
	"type": "event"
},
{
	"anonymous": false,
	"inputs": [
		{ "indexed": true, "internalType": "address", "name": "addr", "type": "address" },
		{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
	],
	"name": "MintFluid",
	"type": "event"
},
{
	"anonymous": false,
	"inputs": [
		{ "indexed": true, "internalType": "address", "name": "from", "type": "address" },
		{ "indexed": true, "internalType": "address", "name": "to", "type": "address" },
		{ "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
	],
	"name": "Transfer",
	"type": "event"
}
]
`

const operatorAbiString = `[
  {
      "inputs": [
        {
        "components": [
           { "internalType": "address", "name": "contractAddr", "type": "address" },
           { "internalType": "address", "name": "newOracle", "type": "address" }
         ],
         "internalType": "struct OracleUpdate[]",
         "name": "newOracles",
         "type": "tuple[]"
        }
	    ],
    "name": "updateOracles",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
	  "inputs": [
		  { "internalType": "address", "name": "token", "type": "address" },
		  {
			  "components": [
				  { "internalType": "string", "name": "clientName", "type": "string" },
				  {
				  "components": [
					  { "internalType": "address", "name": "winner", "type": "address" },
					  { "internalType": "uint256", "name": "winAmount", "type": "uint256" }
				  ],
				  "internalType": "struct Winner[]",
				  "name": "rewards",
				  "type": "tuple[]"
			  }
			  ],
			  "internalType": "struct FluidityReward[]",
			  "name": "rewards",
			  "type": "tuple[]"
		  },
		  { "internalType": "uint256", "name": "firstBlock", "type": "uint256" },
		  { "internalType": "uint256", "name": "lastBlock", "type": "uint256" }
	  ],
	  "name": "reward",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
  }
]`

const registryAbiString = `[
  {
	  "inputs": [
	  { "internalType": "address", "name": "token", "type": "address" },
	  { "internalType": "string[]", "name": "names", "type": "string[]" }
	  ],
	  "name": "getUtilityVars",
	  "outputs": [
	  {
		  "components": [
		  {
			  "components": [
			  { "internalType": "uint256", "name": "poolSizeNative", "type": "uint256" },
			  { "internalType": "uint256", "name": "tokenDecimalScale", "type": "uint256" },
			  { "internalType": "uint256", "name": "exchangeRateNum", "type": "uint256" },
			  { "internalType": "uint256", "name": "exchangeRateDenom", "type": "uint256" },
			  { "internalType": "uint256", "name": "deltaWeightNum", "type": "uint256" },
			  { "internalType": "uint256", "name": "deltaWeightDenom", "type": "uint256" },
			  { "internalType": "string", "name": "customCalculationType", "type": "string" }
			  ],
			  "internalType": "struct UtilityVars",
			  "name": "vars",
			  "type": "tuple"
		  },
		  { "internalType": "string", "name": "name", "type": "string" }
		  ],
		  "internalType": "struct Operator.ScannedUtilityVars[]",
		  "name": "",
		  "type": "tuple[]"
	  }
	  ],
	  "stateMutability": "nonpayable",
	  "type": "function"
  }
]`

const stakingAbiString = `[
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
			{ "indexed": false, "internalType": "uint256", "name": "lockupLength", "type": "uint256" },
			{ "indexed": false, "internalType": "uint256", "name": "lockedTimestamp", "type": "uint256" },
			{ "indexed": false, "internalType": "uint256", "name": "fusdcAmount", "type": "uint256" },
			{ "indexed": false, "internalType": "uint256", "name": "usdcAmount", "type": "uint256" },
			{ "indexed": false, "internalType": "uint256", "name": "wethAmount", "type": "uint256" }
		],
		"name": "Deposited",
		"type": "event"
	}
]`

var (
	FluidityContractAbi ethAbi.ABI
	ExecutorAbi         ethAbi.ABI
	RegistryAbi         ethAbi.ABI
	RewardPoolAbi       ethAbi.ABI
	StakingAbi          ethAbi.ABI
)

// the OracleUpdate struct from solidity, to be passed to updateOracles
type abiOracleUpdate struct {
	ContractAddress ethCommon.Address `abi:"contractAddr"`
	NewOracle       ethCommon.Address `abi:"newOracle"`
}

type (
	// the Winner struct from solidity, to be passed (in the abiFluidityReward struct) to batchReward
	abiWinner struct {
		Winner    ethCommon.Address `abi:"winner"`
		WinAmount *big.Int          `abi:"winAmount"`
	}
	// the FluidityReward struct from solidit, to be passed to batchReward
	abiFluidityReward struct {
		ClientName string      `abi:"clientName"`
		Winners    []abiWinner `abi:"rewards"`
	}
)

func GetRewardPool(client *ethclient.Client, fluidityAddress ethCommon.Address) (*big.Rat, error) {
	boundContract := ethAbiBind.NewBoundContract(
		fluidityAddress,
		FluidityContractAbi,
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
		"rewardPoolAmount",
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to call rewardPoolAmount on Fluidity's contract at address %#v! %v",
			fluidityAddress,
			err,
		)
	}

	amountRat, err := ethereum.CoerceBoundContractResultsToRat(results)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce the results from rewardPoolAmount to rat! %v",
			err,
		)
	}

	return amountRat, nil
}

func TransactBatchReward(client *ethclient.Client, executorAddress, tokenAddress ethCommon.Address, transactionOptions *ethAbiBind.TransactOpts, announcement typesWorker.EthereumSpooledRewards) (*ethTypes.Transaction, error) {
	boundContract := ethAbiBind.NewBoundContract(
		executorAddress,
		ExecutorAbi,
		client,
		client,
		client,
	)

	var (
		firstBlock     = &announcement.FirstBlock.Int
		lastBlock      = &announcement.LastBlock.Int
		batchedRewards = announcement.Rewards

		rewards []abiFluidityReward
	)

	for utility, reward := range batchedRewards {
		winners := make([]abiWinner, len(reward))
		i := 0

		for winnerAddress, winAmount := range reward {
			winner := abiWinner{
				Winner: ethereum.ConvertInternalAddress(winnerAddress),
				// this references a loop variable, so we need to explicitly clone it
				WinAmount: new(big.Int).Set(&winAmount.Int),
			}

			winners[i] = winner
			i++
		}

		reward := abiFluidityReward{
			ClientName: string(utility),
			Winners:    winners,
		}

		rewards = append(rewards, reward)
	}

	gas, err := ethereum.EstimateGas(
		client,
		&ExecutorAbi,
		transactionOptions,
		&executorAddress,
		"reward",
		tokenAddress,
		rewards,
		firstBlock,
		lastBlock,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to estimate gas for calling batchreward! %w",
			err,
		)
	}

	transactionOptions.GasLimit = uint64(float64(gas) * 1.5)

	transaction, err := ethereum.MakeTransaction(
		boundContract,
		transactionOptions,
		"reward",
		tokenAddress,
		rewards,
		firstBlock,
		lastBlock,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to transact the reward function on Fluidity's contract! %v",
			err,
		)
	}

	return transaction, nil
}

// TransactTransfer using the transfer function in the contract, send
// to the address with the amount given
func TransactTransfer(client *ethclient.Client, fluidityContractAddress, recipientAddress ethCommon.Address, amount *big.Int, transactionOptions *ethAbiBind.TransactOpts) (*ethTypes.Transaction, error) {

	boundContract := ethAbiBind.NewBoundContract(
		fluidityContractAddress,
		FluidityContractAbi,
		client,
		client,
		client,
	)

	transaction, err := ethereum.MakeTransaction(
		boundContract,
		transactionOptions,
		"transfer",
		recipientAddress,
		amount,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to transact the transfer function on Fluidity's contract! %v",
			err,
		)
	}

	return transaction, nil
}
