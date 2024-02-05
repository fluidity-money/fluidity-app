// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

// test the emissions code by doing an insertion to the database to see if all goes well!

package main

import (
	"fmt"
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/worker"
)

func TestEmptyInsertion(t *testing.T) {
	var (
		testingHash = "0xtesting123123"
		network_ = string(network.NetworkArbitrum)
	)

	worker.InsertEmissions(worker.Emission{
		Network: network_,
		TransactionHash: testingHash,
	})

	timescale := timescale.Client()

	statementText := fmt.Sprintf(
		"DELETE FROM %s WHERE transaction_hash = $1 AND network = $2",
		worker.TableEmissions,
	)

	_, err := timescale.Exec(statementText, testingHash, network_)

	if err != nil {
		t.Fatalf("failed to exec deletion transaction: %v", err)
	}
}
