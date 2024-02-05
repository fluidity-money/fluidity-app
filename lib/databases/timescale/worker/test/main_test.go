// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

// test the emissions code by doing an insertion to the database to see if all goes well!

package main

import (
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/worker"
)

func TestEmptyInsertion(t *testing.T) {
	worker.InsertEmissions(worker.Emission{
		Network: string(network.NetworkArbitrum),
	})
}
