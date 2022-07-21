// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package test_utils

import (
	"fmt"
	"os"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func main() {
	args := os.Args

	if len(args) != 2 {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Expected one argument containing hex, got %d",
				len(args),
			)
		})
	}

	bytes, err := hexutil.Decode(args[1])

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode hex!"
			k.Payload = err
		})
	}

	b := misc.Blob(bytes)
	m, err := b.MarshalJSON()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to marshal blob to JSON!"
			k.Payload = err
		})
	}

	fmt.Println(string(m))
}
