package fluidity

import (
	"fmt"
	"math/big"

	ethCommon "github.com/ethereum/go-ethereum/common"
	typesEth "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

type RewardData struct {
	TxHash ethCommon.Hash
	FromAddress ethCommon.Address
	FromAmount *big.Int
	ToAddress ethCommon.Address
	ToAmount *big.Int
}

func DecodeRewardData(log typesEth.Log) (RewardData, error) {
	var rewardData RewardData

	var (
		logData   = log.Data
		logTopics = log.Topics
	)

	decodedData, err := fluidityContractAbi.Unpack("Reward", logData)

	if err != nil {
		return rewardData, fmt.Errorf(
			"failed to unpack reward event data! %v",
			err,
		)
	}

	var (
		txHash = decodedData[0].([32]byte)
		fromPadded = logTopics[1].String()
		fromAmount = decodedData[1].(*big.Int)
		toPadded = logTopics[2].String()
		toAmount = decodedData[2].(*big.Int)
	)

	var (
		from = ethCommon.HexToAddress(fromPadded)
		to = ethCommon.HexToAddress(toPadded)
	)

	rewardData = RewardData {
		TxHash: txHash,
		FromAddress: from,
		FromAmount: fromAmount,
		ToAddress: to,
		ToAmount: toAmount,
	}

	return rewardData, nil
}
