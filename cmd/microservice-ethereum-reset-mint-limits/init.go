// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"encoding/json"
	"strings"
)

func init() {
	decoder := json.NewDecoder(strings.NewReader(ScheduleGlobalMintLimitString))

	err := decoder.Decode(ScheduleGlobalMintLimit)

	if err != nil {
		panic(err)
	}

	decoder = json.NewDecoder(strings.NewReader(ScheduleUserMintLimitString))

	err = decoder.Decode(ScheduleUserMintLimit)

	if err != nil {
		panic(err)
	}
}