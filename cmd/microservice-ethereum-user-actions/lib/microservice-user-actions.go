// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package microservice_user_actions

import (
	"fmt"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

const (
	// NetworkEthereum that's having its transactions decoded
	NetworkEthereum = `ethereum`

	// Context used in logging the signature for the desired events
	Context = "MICORSERVICE_USER_ACTIONS"
)

// DecodeTwoLog containing address and a uint from their padded versions
func DecodeTwoLog(addressPadded, amountPadded string) (string, *misc.BigInt, error) {
	var (
		address    = ethCommon.HexToAddress(addressPadded)
		amountHash = ethCommon.HexToHash(amountPadded)
	)

	amountBig := amountHash.Big()

	if amountBig == nil {
		return "", nil, fmt.Errorf(
			"Returned big.Int was nil when decoding a transfer!",
		)
	}

	var (
		amount     = misc.NewBigInt(*amountBig)
		addressHex = address.Hex()
	)

	return addressHex, &amount, nil
}
