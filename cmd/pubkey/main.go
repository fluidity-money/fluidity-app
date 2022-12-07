package main

import (
    "log"

    ethCrypto "github.com/ethereum/go-ethereum/crypto"
    "github.com/fluidity-money/fluidity-app/lib/util"
)

func main() {
    prikeyString := util.GetEnvOrFatal("FLU_WORKER_PRIKEY")
    prikey, err := ethCrypto.HexToECDSA(prikeyString)
    if err != nil {
        panic(err)
    }

    log.Printf("%+s", ethCrypto.PubkeyToAddress(prikey.PublicKey).String())
}
