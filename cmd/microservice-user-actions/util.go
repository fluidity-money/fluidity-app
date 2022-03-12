package main

import "github.com/fluidity-money/fluidity-app/lib/log"

func debug(message string, content ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Format(message, content...)
	})
}
