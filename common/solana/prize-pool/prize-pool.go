// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package prize_pool

import (
	"fmt"
	"math/big"
	"strconv"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/pyth"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"

	"github.com/near/borsh-go"
)

// enum descriminant for the fluidity GetTVL instruction
// there's no associated data with it, so we just need this
const getTvlDiscriminant = uint8(4)

// data layout for the account that GetTVL writes its response into
type tvlDataAccount struct {
	Tvl uint64
}

// GetMintSupply fetches the supply of a token via its mint address
func GetMintSupply(client *rpc.Provider, account solana.PublicKey) (uint64, error) {
	res, err := client.GetTokenSupply(
		account,
		"finalized",
	)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to get fluid token supply! %v",
			err,
		)
	}

	amountString := res.Value.Amount

	amount, err := strconv.ParseUint(amountString, 10, 64)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to parse token supply amount '%s': %v!",
			amountString,
			err,
		)
	}

	return amount, nil
}

// GetPrice wraps fetching the current price of a token
func GetPrice(client *rpc.Provider, account solana.PublicKey) (*big.Rat, error) {
	price, err := pyth.GetPrice(client, account)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get the price using pyth: %v",
			err,
		)
	}

	return price, nil
}

// GetTvl retrieves the current total value locked from chain using a
// simulated transaction
func GetTvl(client *rpc.Provider, fluidityPubkey, tvlDataPubkey, solendPubkey, obligationPubkey, reservePubkey, pythPubkey, switchboardPubkey solana.PublicKey, payerAccount *solana.Wallet) (uint64, error) {

	payer := solana.TransactionPayer(payerAccount.PublicKey())

	accounts := solana.AccountMetaSlice{
		solana.NewAccountMeta(tvlDataPubkey, true, false),
		solana.NewAccountMeta(payerAccount.PublicKey(), false, false),
		solana.NewAccountMeta(solendPubkey, false, false),
		solana.NewAccountMeta(obligationPubkey, true, false),
		solana.NewAccountMeta(reservePubkey, true, false),
		solana.NewAccountMeta(pythPubkey, false, false),
		solana.NewAccountMeta(switchboardPubkey, false, false),
		solana.NewAccountMeta(solana.SysVarClockPubkey, false, false),
	}

	instruction := solana.NewInstruction(
		fluidityPubkey,
		accounts,
		[]byte{getTvlDiscriminant},
	)

	transaction, err := solana.NewTransaction(
		[]solana.Instruction{instruction},
		solana.Hash{},
		payer,
	)

	if err != nil {
		return 0, fmt.Errorf(
			"Failed to create logtvl transaction! %v",
			err,
		)
	}

	_, err = transaction.Sign(func(pk solana.PublicKey) *solana.PrivateKey {
		if payerAccount.PublicKey().Equals(pk) {
			return &payerAccount.PrivateKey
		}

		return nil
	})

	if err != nil {
		return 0, fmt.Errorf(
			"Failed to sign transaction! %v",
			err,
		)
	}

	transactionBinary, err := transaction.MarshalBinary()

	if err != nil {
		return 0, fmt.Errorf(
			"Failed to marshal transaction! %v",
			err,
		)
	}

	value, err := client.SimulateTransaction(
		transactionBinary, // transaction
		false,             // sigVerify
		"finalized",       // commitment
		true,              // replaceRecentBlockhash
		tvlDataPubkey,     // accounts...
	)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to simulate logtvl transaction: %v",
			err,
		)
	}

	if err := handleTransactionError(value); err != nil {
		return 0, err
	}

	tvlAccount := new(tvlDataAccount)

	if lenAccounts := len(accounts); lenAccounts >= 1 {
		return 0, fmt.Errorf(
			"length of the returned accounts is not greater than 1, is %v",
			lenAccounts,
		)
	}

	bytes, err := value.Accounts[0].GetBinary()

	if err != nil {
		return 0, fmt.Errorf(
			"failed to decode tvl data from base64: %v",
			err,
		)
	}

	err = borsh.Deserialize(&tvlAccount, bytes)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to decode tvl data: %v",
			err,
		)
	}

	if err != nil {
		return 0, fmt.Errorf(
			"failed to decode account data: %v",
			err,
		)
	}

	return tvlAccount.Tvl, nil
}