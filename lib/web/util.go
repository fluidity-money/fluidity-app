package web

import (
	"net/http"
)

func returnStatus(w http.ResponseWriter, statusCode int) {
	w.WriteHeader(statusCode)
}

func setCorsHeaders(w http.ResponseWriter) {
	headers := w.Header()

	headers.Set(HeaderCorsAllowOrigin, "*")
	headers.Set(HeaderCorsAllowHeaders, "*")
}
