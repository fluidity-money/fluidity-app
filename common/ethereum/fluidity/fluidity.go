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

const fluidityContractAbiString = `[
  {
    "inputs": [],
    "name": "rewardPoolAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startBlock",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endBlock",
        "type": "uint256"
      }
    ],
    "name": "Reward",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startBlock",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endBlock",
        "type": "uint256"
      }
    ],
    "name": "BlockedReward",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "originalRewardTx",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startBlock",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endBlock",
        "type": "uint256"
      }
    ],
    "name": "UnblockReward",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "txHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "balls",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "payouts",
        "type": "uint256[]"
      }
    ],
    "name": "reward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "global",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "user",
        "type": "uint256"
      }
    ],
    "name": "updateMintLimits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "rewardTx",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "payout",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "firstBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastBlock",
        "type": "uint256"
      }
    ],
    "name": "unblockReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
`

const fluidityOperatorAbiString = `[
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "winner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "utility",
              "type": "address"
            }
          ],
          "internalType": "struct Winner[]",
          "name": "rewards",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "utility",
              "type": "address"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "winner",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "utility",
                  "type": "address"
                }
              ],
              "internalType": "struct Winner[]",
              "name": "winners",
              "type": "tuple[]"
            }
          ],
          "internalType": "struct UtilityWinner[]",
          "name": "utilityRewards",
          "type": "tuple[]"
        },
        {
          "internalType": "uint256",
          "name": "firstBlock",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lastBlock",
          "type": "uint256"
        }
      ],
      "name": "batchReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]`

const workerConfigAbiString = `[
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
  }
]`

var (
	FluidityContractAbi ethAbi.ABI
	FluidityOperatorAbi ethAbi.ABI
	WorkerConfigAbi     ethAbi.ABI
)

// the OracleUpdate struct from solidity, to be passed to updateOracles
type OracleUpdate struct {
	ContractAddress ethCommon.Address `abi:"contractAddr"`
	NewOracle       ethCommon.Address `abi:"newOracle"`
}

type (
	// the Reward struct from solidity, to be passed to batchReward
	RewardArg struct {
		Winner     ethCommon.Address `abi:"winner"`
		WinAmount  *big.Int          `abi:"winAmount"`
	}

	// the UtilityWinner struct from solidity, to be passed to batchReward
	UtilityArg struct {
		Utility ethCommon.Address `abi:"utility"`
		Winners []RewardArg       `abi:"winners"`
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

func computeBatchProperties(batch []typesWorker.EthereumSpooledRewards) ([]RewardArg, []UtilityArg, *big.Int, *big.Int) {
	var (
		rewards          = make([]RewardArg, len(batch))
		// name => user => amount
		utilities        = make(map[ethCommon.Address]map[ethCommon.Address]*big.Int)
		globalFirstBlock = new(big.Int)
		globalLastBlock  = new(big.Int)
	)

	// set a default for the min block
	globalFirstBlock.Set(&batch[0].FirstBlock.Int)

	for i, reward := range batch {
		var (
			winner_        = reward.Winner
			amountInt      = reward.WinAmount
			firstBlockInt  = reward.FirstBlock
			lastBlockInt   = reward.LastBlock
			batchUtilities = reward.Utilities

			winner     = ethereum.ConvertInternalAddress(winner_)
			amount     = &amountInt.Int
			firstBlock = &firstBlockInt.Int
			lastBlock  = &lastBlockInt.Int
		)

		if firstBlock.Cmp(globalFirstBlock) < 0 {
			globalFirstBlock.Set(firstBlock)
		}

		if lastBlock.Cmp(globalLastBlock) > 0 {
			globalLastBlock.Set(lastBlock)
		}

		rewardArg := RewardArg{
			Winner:     winner,
			WinAmount:  amount,
		}

		rewards[i] = rewardArg

		for _, utility := range batchUtilities {
			var (
				name_ = utility.Name
				amount = utility.Amount

				name = ethereum.ConvertInternalAddress(name_)
			)

			utilityByName, exists := utilities[name]

			if !exists {
				utilityByName = make(map[ethCommon.Address]*big.Int)
			}

			utilityByAddress, exists := utilityByName[winner]

			if !exists {
				utilityByAddress = new(big.Int)
			}

			utilityByAddress.Add(utilityByAddress, &amount.Int)

			utilityByName[winner] = utilityByAddress
			utilities[name] = utilityByName
		}
	}

	utilityRewards := make([]UtilityArg, 0)

	for name, rewards := range utilities {
		utilityReward := UtilityArg{
			Utility: name,
			Winners: []RewardArg{},
		}

		for winner, amount := range rewards {
			utilityWinner := RewardArg{
				Winner:    winner,
				WinAmount: amount,
			}

			utilityReward.Winners = append(utilityReward.Winners, utilityWinner)
		}

		utilityRewards = append(utilityRewards, utilityReward)
	}

	return rewards, utilityRewards, globalFirstBlock, globalLastBlock
}

func TransactBatchReward(client *ethclient.Client, fluidityAddress ethCommon.Address, transactionOptions *ethAbiBind.TransactOpts, announcement []typesWorker.EthereumSpooledRewards) (*ethTypes.Transaction, error) {
	boundContract := ethAbiBind.NewBoundContract(
		fluidityAddress,
		FluidityContractAbi,
		client,
		client,
		client,
	)

	rewards, utilityRewards, globalFirstBlock, globalLastBlock := computeBatchProperties(announcement)

	gas, err := ethereum.EstimateGas(
		client,
		&FluidityContractAbi,
		transactionOptions,
		&fluidityAddress,
		"batchReward",
		rewards,
		utilityRewards,
		globalFirstBlock,
		globalLastBlock,
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
		"batchReward",
		rewards,
		utilityRewards,
		globalFirstBlock,
		globalLastBlock,
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

// TransactUpdateMintLimits as the worker, releasing restrictions on
// the amount that can be minted at the time
func TransactUpdateMintLimits(client *ethclient.Client, fluidityContractAddress ethCommon.Address, global, user *big.Int, transactionOptions *ethAbiBind.TransactOpts) (*ethTypes.Transaction, error) {

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
		"updateMintLimits",
		global,
		user,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to transact the updateMintLimits function on Fluidity's contract! %v",
			err,
		)
	}

	return transaction, nil
}

// TransactLegacyReawrd using the deprecated single reward function
func TransactLegacyReward(client *ethclient.Client, fluidityAddress ethCommon.Address, transactionOptions *ethAbiBind.TransactOpts, hash []byte, addressString string, amount *big.Int) (*ethTypes.Transaction, error) {
	boundContract := ethAbiBind.NewBoundContract(
		fluidityAddress,
		FluidityContractAbi,
		client,
		client,
		client,
	)

	var (
		address = ethCommon.HexToAddress(addressString)
		balls   = []*big.Int{big.NewInt(1)}
		payouts = []*big.Int{amount}
	)

	var hashBytes [32]byte
	copy(hashBytes[:], hash)

	transaction, err := ethereum.MakeTransaction(
		boundContract,
		transactionOptions,
		"reward",
		hashBytes,
		address,
		address,
		balls,
		payouts,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to transact the legacy reward function on Fluidity's contract! %v",
			err,
		)
	}

	return transaction, nil
}
