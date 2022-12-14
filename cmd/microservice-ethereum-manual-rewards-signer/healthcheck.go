package main

import "net/http"

func HandleHealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok :)"))
}
