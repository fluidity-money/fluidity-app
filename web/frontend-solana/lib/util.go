package api_fluidity_money

import "net/http"

func returnForbidden(w http.ResponseWriter) interface{} {
	w.WriteHeader(http.StatusForbidden)
	return nil
}
