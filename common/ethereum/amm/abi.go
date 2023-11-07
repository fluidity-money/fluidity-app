package amm

import (
	"fmt"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	ethCommon "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

const ammAbiString = `[
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
        { "indexed": false, "internalType": "int128", "name": "delta", "type": "int128" }
      ],
      "name": "UpdatePositionLiquidity",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "pool", "type": "address" },
        { "indexed": false, "internalType": "int32", "name": "lower", "type": "int32" },
        { "indexed": false, "internalType": "int32", "name": "upper", "type": "int32" }
      ],
      "name": "MintPosition",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "pool", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
        { "indexed": false, "internalType": "uint128", "name": "amount0", "type": "uint128" },
        { "indexed": false, "internalType": "uint128", "name": "amount1", "type": "uint128" }
      ],
      "name": "CollectFees",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "pool", "type": "address" },
        { "indexed": false, "internalType": "bool", "name": "zeroForOne", "type": "bool" },
        { "indexed": false, "internalType": "uint256", "name": "amount0", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "amount1", "type": "uint256" },
        { "indexed": false, "internalType": "int32", "name": "finalTick", "type": "int32" }
      ],
      "name": "Swap1",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amountIn", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "amountOut", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "fluidVolume", "type": "uint256" },
        { "indexed": false, "internalType": "int32", "name": "finalTick0", "type": "int32" },
        { "indexed": false, "internalType": "int32", "name": "finalTick1", "type": "int32" }
      ],
      "name": "Swap2",
      "type": "event"
    }
]`

var AmmAbi ethAbi.ABI

type (
	PositionMint struct {
		Id    misc.BigInt      `json:"id"`
		Lower int32            `json:"lower_tick"`
		Upper int32            `json:"upper_tick"`
		Pool  ethereum.Address `json:"pool"`
	}
	PositionUpdate struct {
		Id    misc.BigInt `json:"id"`
		Delta misc.BigInt `json:"liquidity_delta"`
	}
	CollectFees struct {
		Id      misc.BigInt
		Pool    ethereum.Address
		To      ethereum.Address
		Amount0 misc.BigInt
		Amount1 misc.BigInt
	}
	Swap1 struct {
		User       ethereum.Address
		Pool       ethereum.Address
		ZeroForOne bool
		Amount0    misc.BigInt
		Amount1    misc.BigInt
		FinalTick  int32
	}
	Swap2 struct {
		User        ethereum.Address
		From        ethereum.Address
		To          ethereum.Address
		AmountIn    misc.BigInt
		AmountOut   misc.BigInt
		FluidVolume misc.BigInt
		FinalTick0  int32
		FinalTick1  int32
	}
)

func DecodeMint(log ethTypes.Log) (mint PositionMint, err error) {
	if len(log.Topics) != 4 {
		err = fmt.Errorf(
			"Wrong number of topics! Expected %d, got %d!",
			4,
			len(log.Topics),
		)

		return
	}

	id__ := log.Topics[1]

	id := ethCommon.ConvertInternalHash(id__).Big()

	pool := convertAddress(log.Topics[3])

	data, err := AmmAbi.Unpack("MintPosition", log.Data)

	if err != nil {
		err = fmt.Errorf("Failed to decode mint data! %w", err)

		return
	}

	lower, upper, err := ethCommon.CoerceBoundContractResultsToInt32Pair(data)

	if err != nil {
		return
	}

	mint = PositionMint{
		Id:    misc.NewBigIntFromInt(*id),
		Lower: lower,
		Upper: upper,
		Pool:  pool,
	}

	return mint, nil
}

func DecodeUpdatePosition(log ethTypes.Log) (update PositionUpdate, err error) {
	if len(log.Topics) != 2 {
		err = fmt.Errorf(
			"Wrong number of topics! Expected %d, got %d!",
			2,
			len(log.Topics),
		)

		return
	}

	id__ := log.Topics[1]

	id := ethCommon.ConvertInternalHash(id__).Big()

	if err != nil {
		err = fmt.Errorf("Failed to decode position ID! %w", err)

		return
	}

	data, err := AmmAbi.Unpack("UpdatePositionLiquidity", log.Data)

	if err != nil {
		err = fmt.Errorf("Failed to decode update position data! %w", err)

		return
	}

	delta, err := ethCommon.CoerceBoundContractResultsToInt(data)

	if err != nil {
		return
	}

	update = PositionUpdate{
		Id:    misc.NewBigIntFromInt(*id),
		Delta: misc.NewBigIntFromInt(*delta),
	}

	return update, nil
}

func DecodeCollectFees(log ethTypes.Log) (collect CollectFees, err error) {
	if len(log.Topics) != 4 {
		err = fmt.Errorf(
			"Wrong number of topics! Expected %d, got %d!",
			4,
			len(log.Topics),
		)

		return
	}

	id__ := log.Topics[1]

	id := ethCommon.ConvertInternalHash(id__).Big()

	pool__ := log.Topics[2].String()

	pool_ := common.HexToAddress(pool__)

	pool := ethCommon.ConvertGethAddress(pool_)

	to__ := log.Topics[2].String()

	to_ := common.HexToAddress(to__)

	to := ethCommon.ConvertGethAddress(to_)

	data, err := AmmAbi.Unpack("CollectFees", log.Data)

	if err != nil {
		err = fmt.Errorf("Failed to decode collect fees data! %w", err)

		return
	}

	amount0, err := ethCommon.CoerceBoundContractResultsToInt(data[0:1])

	if err != nil {
		err = fmt.Errorf("Failed to coerce collect call log data to an int!")
		return
	}

	amount1, err := ethCommon.CoerceBoundContractResultsToInt(data[1:2])

	if err != nil {
		err = fmt.Errorf("Failed to coerce collect call log data to an int!")
		return
	}

	collect = CollectFees{
		Id:      misc.NewBigIntFromInt(*id),
		Pool:    pool,
		To:      to,
		Amount0: misc.NewBigIntFromInt(*amount0),
		Amount1: misc.NewBigIntFromInt(*amount1),
	}

	return collect, nil
}

func DecodeSwap1(log ethereum.Log) (swap Swap1, err error) {
	if len(log.Topics) != 3 {
		err = fmt.Errorf(
			"Wrong number of topics! Expected %d, got %d!",
			3,
			len(log.Topics),
		)

		return
	}

	user := convertAddress(log.Topics[1])
	pool := convertAddress(log.Topics[2])

	data, err := AmmAbi.Unpack("Swap1", log.Data)

	if err != nil {
		err = fmt.Errorf("Failed to decode swap1 data! %w", err)

		return
	}

	unexpectedDecodedDataErr := fmt.Errorf(
		"Unexpected data after unpacking swap1 data decoding %+v",
		data,
	)

	zeroForOne, ok := data[0].(bool)
	if !ok {
		err = unexpectedDecodedDataErr
		return
	}

	amount0, ok := data[1].(*big.Int)
	if !ok {
		err = unexpectedDecodedDataErr
		return
	}

	amount1, ok := data[2].(*big.Int)
	if !ok {
		err = unexpectedDecodedDataErr
		return
	}

	finalTick, ok := data[3].(int32)
	if !ok {
		err = unexpectedDecodedDataErr
		return
	}

	swap1 := Swap1{
		User:       user,
		Pool:       pool,
		ZeroForOne: zeroForOne,
		Amount0:    misc.NewBigIntFromInt(*amount0),
		Amount1:    misc.NewBigIntFromInt(*amount1),
		FinalTick:  finalTick,
	}

	return swap1, nil
}

func DecodeSwap2(log ethereum.Log) (swap Swap2, err error) {
	if len(log.Topics) != 4 {
		err = fmt.Errorf(
			"Wrong number of topics! Expected %d, got %d!",
			4,
			len(log.Topics),
		)

		return
	}

	user := convertAddress(log.Topics[1])
	from := convertAddress(log.Topics[2])
	to := convertAddress(log.Topics[3])

	data, err := AmmAbi.Unpack("Swap2", log.Data)

	if err != nil {
		err = fmt.Errorf("Failed to decode swap2 data! %w", err)

		return
	}

	unexpectedDecodedDataErr := fmt.Errorf(
		"Unexpected data after unpacking swap2 data decoding %+v",
		data,
	)

	amountIn, ok := data[0].(*big.Int)
	if !ok {
		err = unexpectedDecodedDataErr
		return
	}

	amountOut, ok := data[1].(*big.Int)
	if !ok {
		err = unexpectedDecodedDataErr
		return
	}

	fluidVolume, ok := data[2].(*big.Int)
	if !ok {
		err = unexpectedDecodedDataErr
		return
	}

	finalTick0, ok := data[3].(int32)
	if !ok {
		err = unexpectedDecodedDataErr
		return
	}

	finalTick1, ok := data[4].(int32)
	if !ok {
		err = unexpectedDecodedDataErr
		return
	}

	swap2 := Swap2{
		User:        user,
		From:        from,
		To:          to,
		AmountIn:    misc.NewBigIntFromInt(*amountIn),
		AmountOut:   misc.NewBigIntFromInt(*amountOut),
		FluidVolume: misc.NewBigIntFromInt(*fluidVolume),
		FinalTick0:  finalTick0,
		FinalTick1:  finalTick1,
	}

	return swap2, nil
}

func convertAddress(address ethTypes.Hash) ethTypes.Address {
	address__ := address.String()

	address_ := common.HexToAddress(address__)

	return ethCommon.ConvertGethAddress(address_)
}
