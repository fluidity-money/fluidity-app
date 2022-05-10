package api_fluidity_money

import (
	"net/http"
	"math/big"

	"github.com/graphql-go/graphql/gqlerrors"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
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

func validArgFloat64toBigrat(args map[string]interface{}, key string) (*big.Rat, bool) {
	if val, ok := args[key]; ok {
		return new(big.Rat).SetFloat64(val.(float64)), true
	}

	return nil, false
}

func validArgInt64toUInt64Bigrat(args map[string]interface{}, key string) (*big.Rat, bool) {
	if val, ok := args[key]; ok && val.(int) > -1 {
		val := uint64(val.(int))
		return new(big.Rat).SetUint64(val), true
	}

    return nil, false
}

func validArgInt(args map[string]interface{}, key string) (int, bool) {
	if val, ok := args[key]; ok {
		return val.(int), true
	}

    return 0, false
}

func validArgString(args map[string]interface{}, key string) (string, bool) {
	if val, ok := args[key]; ok {
		return val.(string), true
	}

    return "", false
}

func graphQLErrorLogHandler(w http.ResponseWriter, r *http.Request, msg []gqlerrors.FormattedError) {
	ipAddress := web.GetIpAddress(r)

	log.App(func(k *log.Log) {
		k.Format(
			"Failed to execute a GraphQL request from ip address %#v, %v",
			ipAddress,
			msg,
		)
	})
	
	w.WriteHeader(http.StatusBadRequest)
}