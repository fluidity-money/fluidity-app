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
  if args[key] == nil {
	return nil, false
  }

  return new(big.Rat).SetFloat64(args[key].(float64)), true
}

func validArgInt64toUInt64Bigrat(args map[string]interface{}, key string) (*big.Rat, bool) {
	if args[key] == nil {
		return nil, false
	}

	return new(big.Rat).SetUint64(uint64(args[key].(int))), true
}

func validArgInt(args map[string]interface{}, key string) (int, bool) {
	if args[key] == nil {
		return 0, false
	}

	return args[key].(int), true
}

func validArgString(args map[string]interface{}, key string) (string, bool) {
	if args[key] == nil {
		return "", false
	}

	return args[key].(string), true
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