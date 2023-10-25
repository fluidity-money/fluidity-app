package amm

import (
	"fmt"

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
    }

]`

var AmmAbi ethAbi.ABI

type (
	PositionMint struct {
		Id    misc.BigInt
		Lower int32
		Upper int32
		Pool  ethereum.Address
	}
	PositionUpdate struct {
		Id    misc.BigInt
		Delta misc.BigInt
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

	if err != nil {
		err = fmt.Errorf("Failed to decode position ID! %w", err)

		return
	}

	pool__ := log.Topics[3].String()

	pool_ := common.HexToAddress(pool__)

	pool := ethCommon.ConvertGethAddress(pool_)

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
