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
	// SplUserAccountTruncated is a truncated version of the spl-token user
	// account struct, used to get the mint
	SplUserAccountTruncated struct {
		Mint solana.PublicKey
	}

	// SplMintAccountTruncated is a truncated version of the spl-token mint
	// account struct, used to get the decimals
	SplMintAccountTruncated struct {
		MintAuthority   [36]byte
		Supply          uint64
		Decimals        uint8
		Initialised     bool
		FreezeAuthority [36]byte
	}
)

// GetMintFromPda by taking an spl-token user account, getting its data from the
// chain, and deserialising to get the mint account
func GetMintFromPda(solanaClient *rpc.Provider, splAccount solana.PublicKey) (solana.PublicKey, error) {
	resp, err := solanaClient.GetAccountInfo(splAccount)

	if err != nil {
		return solana.PublicKey{}, fmt.Errorf(
			"failed to get spl-token account data for account %#v from the RPC! %v",
			splAccount,
			err,
		)
	}

	data, err := resp.GetBinary()

	if err != nil {
		return solana.PublicKey{}, fmt.Errorf(
			"failed to decode the account info: %v",
			err,
		)
	}

	var splData SplUserAccountTruncated

	err = borsh.Deserialize(&splData, data)

	if err != nil {
		return solana.PublicKey{}, fmt.Errorf(
			"issue deserialising spl-token account data for account %#v with data %#v! %v",
			splAccount,
			data,
			err,
		)
	}

	return splData.Mint, nil
}

// GetDecimals by taking an spl-token mint account, getting its data from the
// chain, and deserialising to get the decimals
func GetDecimalsFromMint(solanaClient *rpc.Provider, splAccount solana.PublicKey) (uint8, error) {
	resp, err := solanaClient.GetAccountInfo(splAccount)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to get spl-token account data for account %#v from the RPC! %v",
			splAccount,
			err,
		)
	}

	data, err := resp.GetBinary()

	if err != nil {
		return 0, fmt.Errorf(
			"failed to decode the account info: %v",
			err,
		)
	}

	var splData SplMintAccountTruncated

	err = borsh.Deserialize(&splData, data)

	if err != nil {
		return 0, fmt.Errorf(
			"issue deserialising spl-token account data for account %#v with data %#v! %v",
			splAccount,
			data,
			err,
		)
	}

	return splData.Decimals, nil
}

// GetDecimalsFromPda to get a token's decimals from a PDA of that token
func GetDecimalsFromPda(solanaClient *rpc.Provider, account solana.PublicKey, commitment string) (uint8, error) {
	resp, err := solanaClient.GetTokenAccountBalance(account, commitment)

	if err != nil {
	    return 0, fmt.Errorf(
			"failed to get token balance for pda %s! %w",
			account.String(),
			err,
		)
	}

	return resp.Value.Decimals, nil
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
