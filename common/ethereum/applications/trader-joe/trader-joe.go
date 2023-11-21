// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

// FIXME: we didn't have the time to test this, and it just returns 0. in
// the future we'll unpack their fee structure, and track the volume.

package trader_joe

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const traderJoeSwapLogTopic = "0xad7d6f97abf51ce18e17a38f4d70e975be9c0708474987bb3e26ad21bd93ca70"

const traderJoeSwapAbiString = `[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint24",
        "name": "id",
        "type": "uint24"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "amountsOut",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint24",
        "name": "volatilityAccumulator",
        "type": "uint24"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "totalFees",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "protocolFees",
        "type": "bytes32"
      }
    ],
    "name": "Swap",
    "type": "event"
  }
]
`

var traderJoeSwapAbi ethAbi.ABI

// GetTraderJoeFees always returns 0 fees (for now!)
func GetTraderJoeFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address) (feeData applications.ApplicationFeeData, err error) {
	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("not enough log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != traderJoeSwapLogTopic {
		return feeData, nil
	}

	unpacked, err := traderJoeSwapAbi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to unpack swap log data! %v",
			err,
		)
	}

	// there are 7 slots in this event, and 2 of them are indexed, so... 5
	if len(unpacked) != 5 {
		return feeData, fmt.Errorf(
			"unpacked the wrong number of values! Expected %v, got %v",
			9,
			len(unpacked),
		)
	}

	feeData.Fee = new(big.Rat)

	return
}
