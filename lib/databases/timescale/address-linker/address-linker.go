// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package addresslinker

// address linking links addresses users own on different networks

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	addresslinker "github.com/fluidity-money/fluidity-app/lib/types/address-linker"
)

const (
	// Context to use for logging
	Context = `TIMESCALE/ADDRESSLINKING`

	// TableAddressLinks to store address links in
	TableAddressLinks = `ethereum_linked_addresses`
)

func InsertAddressLink(link addresslinker.LinkedAddresses) {
	timescaleClient := timescale.Client()

	var (
		address = link.Address
		owner   = link.Owner
		network = link.Network

		statementText string
	)

	statementText = fmt.Sprintf(
		`INSERT INTO %s (
			address,
			owner,
			network
		) VALUES (
			$1,
			$2,
			$3
		);`,
		TableAddressLinks,
	)

	_, err := timescaleClient.Exec(
		statementText,
		address,
		owner,
		network,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert an address link!"
			k.Payload = err
		})
	}
}
