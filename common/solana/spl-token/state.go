// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package spl_token

import (
	"fmt"
	"math"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"

	"github.com/near/borsh-go"
)

type (
	// SplAccountTruncated is a truncated version of the spl-token
	// account struct, used to get the mint and decimals of a token account
	SplAccountTruncated struct {
		Mint     solana.PublicKey
		Supply   uint64
		Decimals uint8
	}
)

// SplAccountTruncatedSize is the number of bytes required to encode the data
// in SplAccountTruncated
const SplAccountTruncatedSize = 41

// GetMintAndDecimals by taking an spl-token account, getting it's data from the
// chain, and deserialising to get the mint account and the number of decimals
func GetMintAndDecimals(solanaClient *rpc.Provider, splAccount solana.PublicKey) (solana.PublicKey, uint8, error) {
	resp, err := solanaClient.GetAccountInfo(splAccount)

	if err != nil {
		return solana.PublicKey{}, 0, fmt.Errorf(
			"failed to get spl-token account data for account %#v from the RPC! %v",
			splAccount,
			err,
		)
	}

	data, err := resp.GetBinary()

	if err != nil {
		return solana.PublicKey{}, 0, fmt.Errorf(
			"failed to decode the account info: %v",
			err,
		)
	}

	// if there is not enough data to contain the struct
	if len(data) < SplAccountTruncatedSize {
		return solana.PublicKey{}, 0, fmt.Errorf(
			"spl-token account data for account %#v shorter than expected with length %v and data %#v!",
			len(data),
			data,
			splAccount,
		)
	}

	var splData SplAccountTruncated

	err = borsh.Deserialize(&splData, data)

	if err != nil {
		return solana.PublicKey{}, 0, fmt.Errorf(
			"issue deserialising spl-token account data for account %#v with data %#v! %v",
			splAccount,
			data,
			err,
		)
	}

	return splData.Mint, splData.Decimals, nil
}

// AdjustDecimals takens a rawAmount (int64) and an number of decimals and
// returns a rat of the rawAmount adjusted to that many decimal places
func AdjustDecimals(rawAmount int64, decimals int) *big.Rat {
	// get integer value of denominator
	decimalsAdjusted := math.Pow10(decimals)

	// convert to decimal
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	amount := big.NewRat(rawAmount, 1)

	// divide amount by 10^decimals
	amount = amount.Quo(amount, decimalsRat)

	return amount
}
