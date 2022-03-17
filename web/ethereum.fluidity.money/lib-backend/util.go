package api_fluidity_money

import (
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

func debug(format string, content ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Format(format, content...)
	})
}

func returnForbidden(w http.ResponseWriter) interface{} {
	w.WriteHeader(http.StatusForbidden)
	return nil
}
