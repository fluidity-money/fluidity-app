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
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
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
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "transfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
]`

var fluidityContractAbi ethAbi.ABI

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

func TransactReward(client *ethclient.Client, fluidityAddress ethCommon.Address, transactionOptions *ethAbiBind.TransactOpts, announcement worker.EthereumAnnouncement) (*ethTypes.Transaction, error) {
	var (
		hashString = announcement.TransactionHash.String()
		fromString = announcement.FromAddress.String()
		toString = announcement.ToAddress.String()
		ballsUint = announcement.SourceRandom
		payoutsBigInt = announcement.SourcePayouts
	)

	var (
		hash = ethCommon.HexToHash(hashString)
		from = ethCommon.HexToAddress(fromString)
		to = ethCommon.HexToAddress(toString)
		balls   []*big.Int
		payouts []*big.Int
	)
	for _, p := range payoutsBigInt {
		payouts = append(payouts, &p.Int)
	}

	for _, ball := range ballsUint {
		ballBigInt := big.NewInt(int64(ball))
		balls = append(balls, ballBigInt)
	}

	boundContract := ethAbiBind.NewBoundContract(
		fluidityAddress,
		fluidityContractAbi,
		client,
		client,
		client,
	)

	callOptions := ethAbiBind.CallOpts {
		Pending: false,
		From: transactionOptions.From,
		BlockNumber: nil,
		Context: transactionOptions.Context,
	}

	err := boundContract.Call(
		&callOptions,
		nil,
		"reward",
		hash,
		from,
		to,
		balls,
		payouts,
	)
	if err != nil {
		return nil, fmt.Errorf(
			"reward transaction simulation failed! %w",
			err,
		)
	}

	transaction, err := boundContract.Transact(
		transactionOptions,
		"reward",
		hash,
		from,
		to,
		balls,
		payouts,
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

	transaction, err := boundContract.Transact(
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
