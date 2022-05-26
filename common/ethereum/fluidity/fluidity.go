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
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
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
        {
          "components": [
            { "internalType": "address", "name": "from_address", "type": "address" },
            { "internalType": "address", "name": "to_address", "type": "address" },
            { "internalType": "uint256", "name": "win_amount", "type": "uint256" },
            { "internalType": "bytes32", "name": "transaction_hash", "type": "bytes32" }
          ],
          "internalType": "struct Winner[]",
          "name": "rewards",
          "type": "tuple[]"
        }
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
	    { "indexed": false, "internalType": "bytes32", "name": "txHash", "type": "bytes32" },
	    { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
	    { "indexed": false, "internalType": "uint256", "name": "fromAmount", "type": "uint256" },
	    { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
	    { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
	  ],
	  "name": "Reward",
	  "type": "event"
  }
]`

var fluidityContractAbi ethAbi.ABI

type RewardArg struct {
	FromAddress     ethCommon.Address `json:"from"`
	ToAddress       ethCommon.Address `json:"to"`
	WinAmount       *big.Int          `json:"amount"`
	TransactionHash ethCommon.Hash    `json:"transaction_hash"`
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

func TransactBatchReward(client *ethclient.Client, fluidityAddress ethCommon.Address, transactionOptions *ethAbiBind.TransactOpts, announcement []typesWorker.EthereumWinnerAnnouncement) (*ethTypes.Transaction, error) {
	boundContract := ethAbiBind.NewBoundContract(
		fluidityAddress,
		fluidityContractAbi,
		client,
		client,
		client,
	)

	rewards := make([]RewardArg, len(announcement))

	for i, reward := range announcement {
		var (
			hashString = reward.TransactionHash.String()
			fromString = reward.FromAddress.String()
			toString = reward.ToAddress.String()
			amountInt = reward.WinAmount

			hash = ethCommon.HexToHash(hashString)
			from = ethCommon.HexToAddress(fromString)
			to = ethCommon.HexToAddress(toString)
			amount = &amountInt.Int
		)

		rewardArg := RewardArg {
			TransactionHash: hash,
			FromAddress: from,
			ToAddress: to,
			WinAmount: amount,
		}

		rewards[i] = rewardArg
	}

	transaction, err := ethereum.MakeTransaction(
		boundContract,
		transactionOptions,
		"batchReward",
		rewards,
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

