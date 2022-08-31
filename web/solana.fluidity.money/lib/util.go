// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package api_fluidity_money

import "net/http"

func returnForbidden(w http.ResponseWriter) interface{} {
	w.WriteHeader(http.StatusForbidden)
	return nil
}
