// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package spl_token

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/common/solana"
)

func init() {
	var err error

	TokenProgramAddressPubkey, err = solana.PublicKeyFromBase58(
		TokenProgramAddress,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to decode token address pubkey %#v",
				TokenProgramAddress,
			)
		})
	}

	TokenAssociatedProgramAddressPubkey, err = solana.PublicKeyFromBase58(
		TokenAssociatedProgramAddress,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to decode associated token address pubkey %#v",
				TokenAssociatedProgramAddress,
			)
		})
	}

	WrappedSolMintAddressPubkey, err = solana.PublicKeyFromBase58(
		WrappedSolMintAddress,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to decode wrapped sol mint address pubkey %#v",
				WrappedSolMintAddress,
			)
		})
	}
}
