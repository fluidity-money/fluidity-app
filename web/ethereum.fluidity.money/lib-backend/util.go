package api_fluidity_money

import (
	"math/big"
	"net/http"

	"github.com/graphql-go/graphql/gqlerrors"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

func returnForbidden(w http.ResponseWriter) interface{} {
	w.WriteHeader(http.StatusForbidden)
	return nil
}

func validArgFloat64toBigrat(args map[string]interface{}, key string) (*big.Rat, bool) {
	val, ok := args[key]
	if !ok {
		return nil, false
	}

	return new(big.Rat).SetFloat64(val.(float64)), true
}

func validArgInt64toUInt64Bigrat(args map[string]interface{}, key string) (*big.Rat, bool) {
	val, ok := args[key]
	if !ok && val.(int) < 0 {
		return nil, false
	}

	uVal := uint64(val.(int))
    return new(big.Rat).SetUint64(uVal), true
}

func validArgInt(args map[string]interface{}, key string) (int, bool) {
	val, ok := args[key]
	if !ok {
		return 0, false
	}

	return val.(int), true
}

func validArgString(args map[string]interface{}, key string) (string, bool) {
	val, ok := args[key]
	if !ok {
		return "", false
	}

    return val.(string), true
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
