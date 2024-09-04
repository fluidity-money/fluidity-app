// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package longtail

import (
	"bytes"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	longtailReader := bytes.NewBuffer(longtailBytes)

	var err error

	if longtailAbi, err = ethAbi.JSON(longtailReader); err != nil {
		panic(err)
	}
}
