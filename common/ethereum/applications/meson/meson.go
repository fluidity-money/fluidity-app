// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package meson

import (
	"encoding/binary"
	"fmt"
	"math"
	"math/big"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

// GetMesonFees returns meson's LP and Service Fees as reported by
// the encoded swap
func GetMesonFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int, inputData misc.Blob) (*big.Rat, error) {
	// check the transaction function

	// make sure the input is correct len
	enoughBytes := len(inputData) >= 32

	if !enoughBytes {
		return nil, fmt.Errorf(
			"Not enough bytes in input data %v!",
			len(inputData),
		)
	}

	// check if service fee was paid
	saltBytes := inputData[6:16]
	salt := binary.BigEndian.Uint80

	serviceFeeWaived := salt & 0x40000000000000000000

	// if so, get the amount and x0.1

	// get LP fee

}
