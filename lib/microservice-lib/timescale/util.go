package timescale

import "github.com/fluidity-money/fluidity-app/lib/log"

func debug(message string, arguments ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Context = Context
		k.Format(message, arguments...)
	})
}
