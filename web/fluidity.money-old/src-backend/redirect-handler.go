// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"
	"net/http"
)

const htmlRedirect = `
<html>
	<head>
		<script>window.location="https://fluidity.money/#success"</script>
	</head>
	<body>
		Click <a href="https://fluidity.money/#success">here!</a>
	</body>
</html>`

func HandleRedirect(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, htmlRedirect)
}
