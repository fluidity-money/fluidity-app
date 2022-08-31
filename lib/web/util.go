// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
