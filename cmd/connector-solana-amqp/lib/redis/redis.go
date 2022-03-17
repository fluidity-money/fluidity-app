package redis

import (
	"encoding/json"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/state"
)

func GetLastBlock(key string) uint64 {
    bytes := state.Get(key)

    if len(bytes) == 0 {
        // not found
        return 0
    }

    var res uint64

    err := json.Unmarshal(bytes, &res)

    if err != nil {
        log.Fatal(func (k *log.Log) {
            k.Message = "Failed to get the last seen block from redis!"
            k.Payload = err
        })
    }

    return res
}

func WriteLastBlock(key string, slot uint64) {
    state.Set(key, slot)
}
