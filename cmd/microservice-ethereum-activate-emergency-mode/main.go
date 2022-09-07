package main

import (
	"strings"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"

	"github.com/ethereum/go-ethereum/common/hexutil"
	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

const abiString = `
[
  {
    "inputs": [],
    "name": "enableEmergencyMode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
`

func main() {
	reader := strings.NewReader(abiString)

	emergencyModeAbi, err := ethAbi.JSON(reader)

	if err != nil {
		panic(err)
	}

	updateCall, err := emergencyModeAbi.Pack("enableEmergencyMode")

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to encode updates to an ethereum call!"
			k.Payload = err
		})
	}

	fmt.Println(hexutil.Encode(updateCall))
}
