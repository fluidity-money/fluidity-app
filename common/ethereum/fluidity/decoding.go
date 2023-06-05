// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

import (
	"fmt"
	"math"
	"math/big"
	"time"

	ethCommon "github.com/ethereum/go-ethereum/common"
	commonEth "github.com/fluidity-money/fluidity-app/common/ethereum"
	addresslinker "github.com/fluidity-money/fluidity-app/common/ethereum/address-linker"
	ethLogs "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	typesEth "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
)

type RewardData struct {
	Blocked      bool
	TokenDetails token_details.TokenDetails
	Winner       ethCommon.Address
	Amount       *misc.BigInt
	StartBlock   *misc.BigInt
	EndBlock     *misc.BigInt
}

type UnblockedRewardData struct {
	RewardData         RewardData
	OriginalRewardHash ethCommon.Hash
}

var ErrWrongEvent = fmt.Errorf("event signature doesn't match")

func TryDecodeRewardData(log typesEth.Log, token token_details.TokenDetails) (RewardData, error) {
	var rewardData RewardData

	var (
		logData   = log.Data
		logTopics = log.Topics
	)

	var (
		eventSignatureString = logTopics[0].String()
		eventSignature       = ethCommon.HexToHash(eventSignatureString)

		blocked bool
	)

	switch eventSignature {
	case FluidityContractAbi.Events["Reward"].ID:
		blocked = false

	case FluidityContractAbi.Events["BlockedReward"].ID:
		blocked = true

	default:
		return rewardData, ErrWrongEvent
	}

	// topic, address
	if topicsLen := len(logTopics); topicsLen != 2 {
		return rewardData, fmt.Errorf(
			"Unexpected number of log topics! expected %d, got %d!",
			2,
			topicsLen,
		)
	}

	decodedData, err := FluidityContractAbi.Unpack("Reward", logData)

	if err != nil {
		return rewardData, fmt.Errorf(
			"failed to unpack reward event data! %v",
			err,
		)
	}

	// amount, firstBlock, lastBlock
	if dataLen := len(decodedData); dataLen != 3 {
		return rewardData, fmt.Errorf(
			"Unexpected number of log data! expected %d, got %d!",
			3,
			dataLen,
		)
	}

	var (
		winnerString = logTopics[1].String()

		amountInt     = decodedData[0].(*big.Int)
		startBlockInt = decodedData[1].(*big.Int)
		endBlockInt   = decodedData[2].(*big.Int)
	)

	var (
		winner = ethCommon.HexToAddress(winnerString)

		amount     = misc.NewBigIntFromInt(*amountInt)
		startBlock = misc.NewBigIntFromInt(*startBlockInt)
		endBlock   = misc.NewBigIntFromInt(*endBlockInt)
	)

	rewardData = RewardData{
		Blocked:      blocked,
		TokenDetails: token,
		Winner:       winner,
		Amount:       &amount,
		StartBlock:   &startBlock,
		EndBlock:     &endBlock,
	}

	return rewardData, nil
}

func TryDecodeUnblockedRewardData(log typesEth.Log, token token_details.TokenDetails) (UnblockedRewardData, error) {
	var rewardData UnblockedRewardData

	var (
		logData   = log.Data
		logTopics = log.Topics
	)

	var (
		eventSignatureString = logTopics[0].String()
		eventSignature       = ethCommon.HexToHash(eventSignatureString)
	)

	if eventSignature != FluidityContractAbi.Events["UnblockReward"].ID {
		return rewardData, ErrWrongEvent
	}

	// topic, original hash, address
	if topicsLen := len(logTopics); topicsLen != 3 {
		return rewardData, fmt.Errorf(
			"Unexpected number of log topics! expected %d, got %d!",
			3,
			topicsLen,
		)
	}

	decodedData, err := FluidityContractAbi.Unpack("UnblockReward", logData)

	if err != nil {
		return rewardData, fmt.Errorf(
			"failed to unpack reward event data! %v",
			err,
		)
	}

	// amount, firstBlock, lastBlock
	if dataLen := len(decodedData); dataLen != 3 {
		return rewardData, fmt.Errorf(
			"Unexpected number of log data! expected %d, got %d!",
			3,
			dataLen,
		)
	}

	var (
		rewardHashString = logTopics[1].String()
		winnerString     = logTopics[2].String()
		amountInt        = decodedData[0].(*big.Int)
		startBlockInt    = decodedData[1].(*big.Int)
		endBlockInt      = decodedData[2].(*big.Int)
	)

	var (
		rewardHash = ethCommon.HexToHash(rewardHashString)
		winner     = ethCommon.HexToAddress(winnerString)
		amount     = misc.NewBigIntFromInt(*amountInt)
		startBlock = misc.NewBigIntFromInt(*startBlockInt)
		endBlock   = misc.NewBigIntFromInt(*endBlockInt)
	)

	rewardData = UnblockedRewardData{
		RewardData: RewardData{
			TokenDetails: token,
			Winner:       winner,
			Amount:       &amount,
			StartBlock:   &startBlock,
			EndBlock:     &endBlock,
		},
		OriginalRewardHash: rewardHash,
	}

	return rewardData, nil
}

const (
	UsdcDecimals  = 6
	FusdcDecimals = 6
	WethDecimals  = 18
)

func TryDecodeStakingEventData(l ethLogs.Log, wethPriceUsd *big.Rat) (ethereum.StakingEvent, error) {
	var (
		logTopics = l.Topics
		logData   = l.Data

		stakingEvent ethereum.StakingEvent
	)

	var (
		eventSignatureString = logTopics[0].String()
		eventSignature       = ethCommon.HexToHash(eventSignatureString)
	)

	switch eventSignature {
	case StakingAbi.Events["Deposited"].ID:

		decodedData, err := StakingAbi.Unpack("Deposited", logData)

		if err != nil {
			return stakingEvent, fmt.Errorf(
				"failed to unpack Staked event data! %v",
				err,
			)
		}

		// lockupLength, lockedTimestamp, fusdcAmount, usdcAmount, wethAmount
		if dataLen := len(decodedData); dataLen != 5 {
			return stakingEvent, fmt.Errorf(
				"Unexpected number of log data! expected %d, got %d!",
				5,
				dataLen,
			)
		}

		// event, sender address
		if topicsLen := len(logTopics); topicsLen != 2 {
			return stakingEvent, fmt.Errorf(
				"Unexpected number of log topics! expected %d, got %d!",
				2,
				topicsLen,
			)
		}

		var (
			addressString      = logTopics[1].String()
			lockupLengthInt    = decodedData[0].(*big.Int)
			lockedTimestampInt = decodedData[1].(*big.Int)
			fusdcAmountInt     = decodedData[2].(*big.Int)
			usdcAmountInt      = decodedData[3].(*big.Int)
			wethAmountInt      = decodedData[4].(*big.Int)
		)

		addressNormal := ethCommon.HexToAddress(addressString)

		if !lockedTimestampInt.IsInt64() {
			return stakingEvent, fmt.Errorf(
				"Decoded a timestamp that was larger than int64! %v",
				lockedTimestampInt.String(),
			)
		}

		lockedTimestampInt64 := lockedTimestampInt.Int64()
		lockedTimestamp := time.Unix(lockedTimestampInt64, 0)

		stakingEvent.Address = commonEth.ConvertGethAddress(addressNormal)
		stakingEvent.InsertedDate = lockedTimestamp

		usdcDecimals := math.Pow10(UsdcDecimals)
		fusdcDecimals := math.Pow10(FusdcDecimals)
		wethDecimals := math.Pow10(WethDecimals)

		usdcDecimalsRat := new(big.Rat).SetFloat64(usdcDecimals)
		fusdcDecimalsRat := new(big.Rat).SetFloat64(fusdcDecimals)
		wethDecimalsRat := new(big.Rat).SetFloat64(wethDecimals)

		// fUSDC USD = fusdc / fusdc_decimals
		fusdcRat := new(big.Rat).SetInt(fusdcAmountInt)
		fusdcRat.Quo(fusdcRat, fusdcDecimalsRat)

		// USDC USD = usdc / usdc_decimals
		usdcRat := new(big.Rat).SetInt(usdcAmountInt)
		usdcRat.Quo(usdcRat, usdcDecimalsRat)

		// weth usd = (weth / weth_decimals) * (weth price usd)
		wethRat := new(big.Rat).SetInt(wethAmountInt)
		wethRat.Quo(wethRat, wethDecimalsRat)
		wethRat.Mul(wethRat, wethPriceUsd)

		sumUsd := new(big.Rat).Add(fusdcRat, usdcRat)
		sumUsd = sumUsd.Add(sumUsd, wethRat)

		// round to nearest whole

		sumUsdInt := new(big.Int).Quo(sumUsd.Num(), sumUsd.Denom())

		stakingEvent.UsdAmount = misc.NewBigIntFromInt(*sumUsdInt)

		// convert lockup length (seconds) to days
		lockupLengthSeconds := int(lockupLengthInt.Int64())
		lockupLength := time.Duration(lockupLengthSeconds) * time.Second
		lockupLengthDays := math.Floor(lockupLength.Hours() / 24)

		// will always be an integer number of days (max lockup time is a year)
		stakingEvent.LockupLength = int(lockupLengthDays)

		return stakingEvent, nil
	default:
		return stakingEvent, ErrWrongEvent
	}
}

type TestnetOwnerPair struct {
	// Owner for the address that owns TestnetAddress
	Owner   ethCommon.Address
	// TestnetAddress for the testnet address used on Ropsten
	TestnetAddress ethCommon.Address
}

// TryDecodeAddressConfirmed to decode ownership confirmation of a testnet address
func TryDecodeAddressConfirmed(log ethLogs.Log) (TestnetOwnerPair, error) {
	var (
		logTopics			 = log.Topics
		eventSignatureString = logTopics[0].String()
		eventSignature       = ethCommon.HexToHash(eventSignatureString)

		addressConfirmedEvent TestnetOwnerPair
	)

	switch eventSignature {
	case addresslinker.AddressConfirmerAbi.Events["AddressConfirmed"].ID:
		// no data to unpack, all indexed
		if len(logTopics) != 3 {
			return addressConfirmedEvent, fmt.Errorf(
				"wrong number of log topics for event AddressConfirmed - expected 3, got %d",
				len(logTopics),
			)
		}

		var (
			testnetAddressString  = logTopics[1].String()
			ownerAddressString    = logTopics[2].String()
		)

		addressConfirmedEvent.TestnetAddress = ethCommon.HexToAddress(testnetAddressString)
		addressConfirmedEvent.Owner = ethCommon.HexToAddress(ownerAddressString)

		return addressConfirmedEvent, nil
	default:
		return addressConfirmedEvent, ErrWrongEvent
	}
}
