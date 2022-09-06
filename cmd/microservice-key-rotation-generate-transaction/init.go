package main

import (
    "strings"
    ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
    reader := strings.NewReader(workerConfigAbiString)

    var err error

    if workerConfigAbi, err = ethAbi.JSON(reader); err != nil {
	panic(err)
    }
}
