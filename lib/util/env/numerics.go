package env

import (
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

func Uint64FromEnvOrFatal(env string) uint64 {
	resString := GetEnvOrFatal(env)

	res, err := strconv.ParseUint(resString, 10, 64)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to parse a uint64 from env!"
			k.Payload = err
		})
	}

	return res
}
