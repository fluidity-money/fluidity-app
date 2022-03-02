package web

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"net/http"
)

func debug(message string, content ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Context = Context
		k.Format(message, content...)
	})
}

func returnStatus(w http.ResponseWriter, statusCode int) {
	w.WriteHeader(statusCode)
}

func setCorsHeaders(w http.ResponseWriter) {
	headers := w.Header()

	headers.Set(HeaderCorsAllowOrigin, "*")
	headers.Set(HeaderCorsAllowHeaders, "*")
}
