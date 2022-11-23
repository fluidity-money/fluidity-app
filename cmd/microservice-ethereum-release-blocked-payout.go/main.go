package main

import (
	"encoding/json"
	"fmt"
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
    // EnvBlockedPayoutPayload to read blocked payout info from
    EnvBlockedPayoutPayload = `FLU_ETHEREUM_BLOCKED_PAYOUT_PAYLOAD`

    // EnvShouldPayout to determine if the reward should be paid out or just acknowledged
    EnvShouldPayout = `FLU_ETHEREUM_PAYOUT`
)

const abiString = `
[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "payout",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "firstBlock",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lastBlock",
          "type": "uint256"
        }
      ],
      "name": "unblockReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]
`

func main() {
    reader := strings.NewReader(abiString)

    unblockRewardAbi, err := ethAbi.JSON(reader)

    if err != nil {
        panic(err)
    }

    var (
        payload    = util.GetEnvOrFatal(EnvBlockedPayoutPayload)
        payout_    = util.GetEnvOrFatal(EnvShouldPayout)
        payout     bool
    )

    switch payout_ {
        case "true":
            payout = true
        case "false":
            payout = false
        default:
            log.Fatal(func (k *log.Log) {
                k.Format(
                    "Invalid value for %s %s - expected true or false!",
                    EnvBlockedPayoutPayload,
                    payout_,
                )
            })
    }

    var blockedReward winners.Winner

    err = json.Unmarshal([]byte(payload), &blockedReward)

    if err != nil {
        log.Fatal(func (k *log.Log) {
            k.Message = "Failed to read a blocked reward payload from env!"
            k.Payload = err
        })
    }

    var (
        user_ = blockedReward.WinnerAddress
        amount_ = blockedReward.WinningAmount
        firstBlock_ = blockedReward.BatchFirstBlock
        lastBlock_ = blockedReward.BatchLastBlock

        user = common.HexToAddress(user_)
        amount = &amount_.Int
        firstBlock = &firstBlock_.Int
        lastBlock = &lastBlock_.Int
    )

    unblockCall, err := unblockRewardAbi.Pack(
        "unblockReward",
        user,
        amount,
        payout,
        firstBlock,
        lastBlock,
    )

    if err != nil {
        log.Fatal(func (k *log.Log) {
            k.Message = "Failed to encode an unblockReward call!"
            k.Payload = err
        })
    }

	fmt.Println(hexutil.Encode(unblockCall))
}
