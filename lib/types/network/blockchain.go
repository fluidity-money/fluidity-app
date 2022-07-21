// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package network

// blockchain networks that we currently support, hardcoded for the SQL constants

// BlockchainNetwork backend that we currently support
type BlockchainNetwork string

const (
	NetworkEthereum BlockchainNetwork = `ethereum`
	NetworkSolana   BlockchainNetwork = `solana`
)
