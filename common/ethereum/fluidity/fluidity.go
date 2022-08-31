// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
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
            { "internalType": "uint256", "name": "win_amount", "type": "uint256" },
            { "internalType": "uint256", "name": "first_block", "type": "uint256" },
            { "internalType": "uint256", "name": "last_block", "type": "uint256" }
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
	    { "indexed": false, "internalType": "uint256", "name": "endBlock", "type": "uint256" }
	  ],
	  "name": "Reward",
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
  }
]`

const workerConfigAbiString = `[
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "newOracles",
        "type": "address[]"
      }
    ],
    "name": "updateOracles",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]`

var (
	fluidityContractAbi ethAbi.ABI
	workerConfigAbi     ethAbi.ABI
)

// the Reward struct from solidity, to be passed to batchReward
type RewardArg struct {
	Winner    ethCommon.Address `json:"from"`
	WinAmount *big.Int          `json:"amount"`
}

func GetRewardPool(client *ethclient.Client, fluidityAddress ethCommon.Address) (*big.Rat, error) {
	boundContract := ethAbiBind.NewBoundContract(
		fluidityAddress,
		fluidityContractAbi,
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

func TransactBatchReward(client *ethclient.Client, fluidityAddress ethCommon.Address, transactionOptions *ethAbiBind.TransactOpts, announcement []typesWorker.EthereumSpooledRewards) (*ethTypes.Transaction, error) {
	boundContract := ethAbiBind.NewBoundContract(
		fluidityAddress,
		fluidityContractAbi,
		client,
		client,
		client,
	)

	var (
		rewards          = make([]RewardArg, len(announcement))
		globalFirstBlock = new(big.Int)
		globalLastBlock  = new(big.Int)
	)

	// set a default for the min block
	globalFirstBlock.Set(&announcement[0].FirstBlock.Int)

	for i, reward := range announcement {
		var (
			winnerString  = reward.Winner.String()
			amountInt     = reward.WinAmount
			firstBlockInt = reward.FirstBlock
			lastBlockInt  = reward.LastBlock

			winner     = ethCommon.HexToAddress(winnerString)
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
			Winner:    winner,
			WinAmount: amount,
		}

		rewards[i] = rewardArg
	}

	transaction, err := ethereum.MakeTransaction(
		boundContract,
		transactionOptions,
		"batchReward",
		rewards,
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
		fluidityContractAbi,
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

// TransactLegacyReawrd using the deprecated single reward function
func TransactLegacyReward(client *ethclient.Client, fluidityAddress ethCommon.Address, transactionOptions *ethAbiBind.TransactOpts, hash []byte, addressString string, amount *big.Int) (*ethTypes.Transaction, error) {
	boundContract := ethAbiBind.NewBoundContract(
		fluidityAddress,
		fluidityContractAbi,
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

// UpdateOracles to create and sign (but not send!) the updateOracles call to the worker config contract
func UpdateOracles(client *ethclient.Client, workerConfigContractAddress ethCommon.Address, signerKey *ecdsa.PrivateKey, transactionOptions *ethAbiBind.TransactOpts, newOracles []ethCommon.Address) (*ethTypes.Transaction, error) {
	chainId, err := client.ChainID(context.Background())

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get chain ID from client! %v",
			err,
		)
	}

	var (
		value     = transactionOptions.Value
		nonce     = transactionOptions.Nonce
		gasFeeCap = transactionOptions.GasFeeCap
		gasTipCap = transactionOptions.GasTipCap
	)

	signer := types.NewLondonSigner(chainId)
	dataBytes, err := workerConfigAbi.Pack("updateOracles", newOracles)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to encode call to updateOracles! %v",
			err,
		)
	}

	txData := &types.DynamicFeeTx{
		ChainID:   chainId,
		Nonce:     nonce.Uint64(),
		GasTipCap: gasTipCap,
		GasFeeCap: gasFeeCap,
		To:        &workerConfigContractAddress,
		Value:     value,
		Data:      dataBytes,
	}

	signedTxn, err := types.SignNewTx(signerKey, signer, txData)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to sign the transaction to update the oracles! %v",
			err,
		)
	}

	return signedTxn, nil
}
