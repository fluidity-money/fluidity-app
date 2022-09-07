package main

import (
	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	"strings"
)

func init() {
	reader := strings.NewReader(workerConfigAbiString)

	var err error

	if workerConfigAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
