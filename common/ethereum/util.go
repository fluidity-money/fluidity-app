package ethereum

import "github.com/fluidity-money/fluidity-app/lib/log"

func debug(format string, content ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Format(format, content...)
	})
}

