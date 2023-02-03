// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package microservice_user_actions

import (
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"golang.org/x/crypto/sha3"
)

const (
	// FilterEventTransferSignature to use to filter for transfer signatures
	FilterEventTransferSignature = `Transfer(address,address,uint256)`

	// FilterEventMintFluidSignature to use to filter for MintFluid events
	FilterEventMintFluidSignature = `MintFluid(address,uint256)`

	// FilterEventBurnFluidSignature to use to filter for BurnFluid events
	FilterEventBurnFluidSignature = `BurnFluid(address,uint256)`
)

const (
	// EventTransfer generated by FilterEventTransferSignature
	EventTransfer = iota

	// EventMintFluid generated by FilterEventMintFluidSignature
	EventMintFluid

	// EventBurnFluid generated by FilterEventBurnFluidSignature
	EventBurnFluid
)

// signatures to filter for to find transfers, mints and burns happening
// based on the log output

var (
	eventSignatureTransfer = HashEventSignature(
		FilterEventTransferSignature,
	)

	eventSignatureMint = HashEventSignature(
		FilterEventMintFluidSignature,
	)

	eventSignatureBurn = HashEventSignature(
		FilterEventBurnFluidSignature,
	)
)

// ClassifyEventSignature based on the topic hash, returning Event something
// and error if it wasn't possible to identify the signature
func ClassifyEventSignature(content string) (int, error) {
	switch content {
	case eventSignatureTransfer:
		return EventTransfer, nil

	case eventSignatureMint:
		return EventMintFluid, nil

	case eventSignatureBurn:
		return EventBurnFluid, nil

	default:
		return 0, fmt.Errorf(
			"Log signature doesn't match anything seen! Is %#v!",
			content,
		)
	}
}

// HashEventSignature to find the hex representation of a event signature
func HashEventSignature(eventSignature string) string {
	var (
		eventSignatureBytes = []byte(eventSignature)
		hash                = sha3.NewLegacyKeccak256()
		hashDigest          []byte
	)

	hash.Write(eventSignatureBytes)

	hashDigest = hash.Sum(nil)

	return fmt.Sprintf("0x%x", hashDigest)
}

func init() {
	log.Debug(func(k *log.Log) {
		k.Context = Context

		k.Format(
			"Transfer events: %#v, Mint events: %#v, Burn events: %#v",
			eventSignatureTransfer,
			eventSignatureMint,
			eventSignatureBurn,
		)
	})
}