package saddle

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

const saddleTokenSwapLogTopic = "0xc6c1e0630dbe9130cc068028486c0d118ddcea348550819defd5cb8c257f8a38"

const SaddleSwapAbiString = `[
{
	"anonymous": false,
	"inputs": [
	{
		"indexed": true,
		"internalType": "address",
		"name": "buyer",
		"type": "address"
	},
	{
		"indexed": false,
		"internalType": "uint256",
		"name": "tokensSold",
		"type": "uint256"
	},
	{
		"indexed": false,
		"internalType": "uint256",
		"name": "tokensBought",
		"type": "uint256"
	},
	{
		"indexed": false,
		"internalType": "uint128",
		"name": "soldId",
		"type": "uint128"
	},
	{
		"indexed": false,
		"internalType": "uint128",
		"name": "boughtId",
		"type": "uint128"
	}
	],
	"name": "TokenSwap",
	"type": "event"
},
{
	"inputs": [],
	"name": "swapStorage",
	"outputs": [
	{
		"internalType": "uint256",
		"name": "initialA",
		"type": "uint256"
	},
	{
		"internalType": "uint256",
		"name": "futureA",
		"type": "uint256"
	},
	{
		"internalType": "uint256",
		"name": "initialATime",
		"type": "uint256"
	},
	{
		"internalType": "uint256",
		"name": "futureATime",
		"type": "uint256"
	},
	{
		"internalType": "uint256",
		"name": "swapFee",
		"type": "uint256"
	},
	{
		"internalType": "uint256",
		"name": "adminFee",
		"type": "uint256"
	},
	{
		"internalType": "contract LPToken",
		"name": "lpToken",
		"type": "address"
	}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"inputs": [
	{
		"internalType": "uint8",
		"name": "index",
		"type": "uint8"
	}
	],
	"name": "getToken",
	"outputs": [
	{
		"internalType": "contract IERC20",
		"name": "",
		"type": "address"
	}
	],
	"stateMutability": "view",
	"type": "function"
}
]`

const ERC20AbiString = `[
{
	"inputs": [],
	"name": "decimals",
	"outputs": [
	{
		"internalType": "uint8",
		"name": "",
		"type": "uint8"
	}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"anonymous": false,
	"inputs": [
	    {
	      "indexed": true,
	      "name": "from",
	      "type": "address"
	    },
	    {
	      "indexed": true,
	      "name": "to",
	      "type": "address"
	    },
	    {
	      "indexed": false,
	      "name": "value",
	      "type": "uint256"
		}
	],
	"name": "Transfer",
	"type": "event"
}]`

// uint constant FEE_DENOMINATOR, used by saddle for scaling fees
var feeDenom = big.NewRat(1e10, 1)

var saddleSwapAbi ethAbi.ABI

var erc20Abi ethAbi.ABI

func GetSaddleFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int, txReceipt ethTypes.Receipt) (*big.Rat, error) {
	if len(transfer.Log.Topics) < 1 {
		return nil, fmt.Errorf("Not enough log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != saddleTokenSwapLogTopic {
		return nil, nil
	}

	unpacked, err := saddleSwapAbi.Unpack("TokenSwap", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 4 {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected %v, got %v",
			4,
			len(unpacked),
		)
	}

	data, err := ethereum.CoerceBoundContractResultsToRats(unpacked)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	var (
		tokenSold   = data[0]
		tokenBought = data[1]
		idSold_     = data[2]
		idBought_   = data[3]

		// this is a uint8 in the contract, it's just returned as a uint256
		idSold__,   _ = idSold_.Float64()
		idBought__, _ = idBought_.Float64()

		idSold   = uint8(idSold__)
		idBought = uint8(idBought__)
	)

	tokenIn_, err := ethereum.StaticCall(
		client,
		ethereum.ConvertInternalAddress(transfer.Log.Address),
		saddleSwapAbi,
		"getToken",
		idSold,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to fetch saddle token data for sold index %d! %v",
			idSold,
			err,
		)
	}

	tokenOut_, err := ethereum.StaticCall(
		client,
		ethereum.ConvertInternalAddress(transfer.Log.Address),
		saddleSwapAbi,
		"getToken",
		idBought,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to fetch saddle token data for bought index %d! %v",
			idBought,
			err,
		)
	}

	addresses_ := []interface{}{tokenIn_[0], tokenOut_[0]}

	addresses, err := ethereum.CoerceBoundContractResultsToAddresses(addresses_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to addresses! %v",
			err,
		)
	}

	tokenInIsFluid := addresses[0] == fluidTokenContract
	tokenOutIsFluid := addresses[1] == fluidTokenContract

	if !( tokenInIsFluid || tokenOutIsFluid) {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a Saddle swap in transaction %#v involving the tokens %s %s instead of the fluid token %s - skipping!",
				transfer.TransactionHash.String(),
				addresses[0],
				addresses[1],
				fluidTokenContract,
			)
		})

		return nil, nil
	}

	decimals_, err := ethereum.StaticCall(
		client,
		addresses[1],
		erc20Abi,
		"decimals",
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to call the decimals method on the underlying token %s! %v",
			addresses[1].String(),
			err,
		)
	}

	decimals, err := ethereum.CoerceBoundContractResultsToUint8(decimals_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce token decimals to uint8! %v",
			err,
		)
	}

	// mult = 10**(18 - decimals)
	// Fee = dy * swapFee * (1 / fee_denom)
	// given amount out:
	// Fee = (out * swapFee * (1 / fee_denom)) / (mult * (1 - (swapFee * (1 / fee_denom)))

	swapContractAddress := ethereum.ConvertInternalAddress(transfer.Log.Address)

	res, err := ethereum.StaticCall(
		client,
		swapContractAddress,
		saddleSwapAbi,
		"swapStorage",
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to fetch saddle swap info! %v",
			err,
		)
	}

	swapFee, err := ethereum.CoerceBoundContractResultsToRat(res[4:5])

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce token decimals to uint8! %v",
			err,
		)
	}

	var (
		swapFeeAdjusted = new(big.Rat).Quo(swapFee, feeDenom)

		ten = big.NewRat(10, 1)
	)

	if tokenInIsFluid {
		// swap fees are taken from the out token, which we don't know the price of
		// instead just estimate it, since we assume the in and out tokens are worth about the same
		fee := new(big.Rat).Mul(tokenSold, swapFeeAdjusted)

		fluidDecimals := ethereum.BigPow(ten, tokenDecimals)

		fee.Quo(fee, fluidDecimals)

		return fee, nil
	}

	// otherwise, calculate the original amount bought and then calculate the fee based on that

	// Fee = tokenBought * swapFeeAdjusted / (mult * (1 - swapFeeAdjusted) )

	mult := ethereum.BigPow(ten, (18 - int(decimals)))

	numerator := new(big.Rat).Mul(tokenBought, swapFeeAdjusted)

	denom_ := new(big.Rat).Sub(big.NewRat(1,1), swapFeeAdjusted)
	denominator := new(big.Rat).Mul(mult, denom_)

	fee := new(big.Rat).Quo(numerator, denominator)

	// convert to raw usd

	tokenDecimalsScale := ethereum.BigPow(ten, tokenDecimals)

	feeUsd := new(big.Rat).Quo(fee, tokenDecimalsScale)

	return feeUsd, nil
}
