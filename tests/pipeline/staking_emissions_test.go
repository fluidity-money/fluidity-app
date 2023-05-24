// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"
	"math/rand"
	"testing"
	"time"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/airdrop"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	ethQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/tests/pipeline/libtest"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// create log data - lockupLength, lockedTimestamp, fusdcAmount, usdAmount, wethAmount
func createLogData(lockupLength, usdAmount int32, lockedTimestamp int64) (misc.Blob, error) {
	const zeroData = "0000000000000000000000000000000000000000000000000000000000000000"

	lockupLengthHex := fmt.Sprintf("%x", lockupLength)
	lockedTimestampHex := fmt.Sprintf("%x", lockedTimestamp)
	usdAmountHex := fmt.Sprintf("%x", usdAmount)

	// hex encode and pad length
	lockupLengthData := zeroData[:64-len(lockupLengthHex)] + lockupLengthHex
	lockedTimestampData := zeroData[:64-len(lockedTimestampHex)] + lockedTimestampHex
	usdAmountData := zeroData[:64-len(usdAmountHex)] + usdAmountHex

	// TODO requires fusdc/weth amount
	logData_ := "0x" + lockupLengthData + lockedTimestampData + zeroData + usdAmountData + zeroData
	logData, err := hexutil.Decode(logData_)

	if err != nil {
		return nil, err
	}

	data := misc.Blob(logData)

	return data, nil
}

func TestStakingEmissions(t *testing.T) {
	var (
		logsQueue    = ethQueue.TopicLogs
		fusdtAddress = ethTypes.AddressFromString("0x737f9DC58538B222a6159EfA9CC548AB4b7a3F1e")

		address = libtest.RandomHash()
		// 30 - 365 days
		lockupLength        = rand.Int31n(334) + 31
		lockedTimestamp     = time.Now().UTC()
		lockedTimestampUnix = lockedTimestamp.Unix()
		// $10 - $2000
		usdAmount = rand.Int31n(2000) + 10
	)

	logData, err := createLogData(lockupLength, usdAmount, lockedTimestampUnix)
	require.NoError(t, err)

	topicEmission := ethTypes.HashFromString("0x6381ea17a5324d29cc015352644672ead5185c1c61a0d3a521eda97e35cec97e")

	log := ethTypes.Log{
		Address: fusdtAddress,
		Topics:  []ethTypes.Hash{topicEmission, address},
		Data:    logData,
	}

	// sleep between messages to avoid ordering issues
	time.Sleep(time.Second)

	// send message from staking-emissions -> timescale
	queue.SendMessage(logsQueue, log)

	time.Sleep(time.Second)

	// should find this event as it's just been inserted and has a >0 lockup length
	stakingEvents := airdrop.GetCurrentStakingEvents()

	assert.Len(t, stakingEvents, 1)
	expectedEvent := ethTypes.StakingEvent{
		Address:      ethTypes.AddressFromString(address.String()),
		UsdAmount:    misc.BigIntFromInt64(int64(usdAmount)),
		LockupLength: int(lockupLength),
		InsertedDate: lockedTimestamp,
	}

	stakingEvent := stakingEvents[0]
	// comparing time.Times directly doesn't work properly, so compare fields individually
	assert.Equal(t, expectedEvent.Address, stakingEvent.Address)
	assert.Equal(t, expectedEvent.UsdAmount, stakingEvent.UsdAmount)
	assert.Equal(t, expectedEvent.LockupLength, stakingEvent.LockupLength)
	// errors out due to timezone differences and go timestamps including millis/micros
	// so instead just compare seconds
	assert.Equal(t, expectedEvent.InsertedDate.Unix(), stakingEvent.InsertedDate.Unix())
}
