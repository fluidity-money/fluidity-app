package main

import (
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
    EnvLogPath = `FLU_ETHEREUM_KEY_ROTATION_LOG_PATH`
)

type OracleUpdate struct {
    OldOracle ethCommon.Address
    NewOracle ethCommon.Address `abi:"newOracle"`
    Contract ethCommon.Address `abi:"contractAddr"`
}


func main() {
    path := util.GetEnvOrFatal(EnvLogPath)

    updates, err := parseLogs(path)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to parse logs from file!"
            k.Payload = err
        })
    }

    for _, update := range updates {
        log.Debug(func(k *log.Log) {
            k.Format(
                "Validated an update on contract %s from %s to %s",
                update.Contract,
                update.OldOracle,
                update.NewOracle,
            )
        })
    }

    updateCall, err := workerConfigAbi.Pack("updateOracles", updates)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to encode updates to an ethereum call!"
            k.Payload = err
        })
    }

    log.App(func(k *log.Log) {
        k.Format("Call the workerConfig contract with data %s", hexutil.Encode(updateCall))
    })
}
