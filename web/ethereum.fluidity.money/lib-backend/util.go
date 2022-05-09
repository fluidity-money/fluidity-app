package api_fluidity_money

import (
	"net/http"
	"math/big"

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

func convertFloat64toBigrat(value float64) *big.Rat {
  return new(big.Rat).SetFloat64(value)
}

func convertUint64toBigrat(value uint64) *big.Rat {
	return new(big.Rat).SetUint64(value)
}