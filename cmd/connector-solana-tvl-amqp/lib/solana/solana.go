// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

import (
	"context"
	"encoding/base64"
	"fmt"

	prize_pool "github.com/fluidity-money/fluidity-app/common/solana/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

// enum descriminant for the fluidity GetTVL instruction
// there's no associated data with it, so we just need this
const getTvlDiscriminant = uint8(4)

// data layout for the account that GetTVL writes its response into
type tvlDataAccount struct {
	Tvl uint64
}

// the solana-go sdk types this response incorrectly, leaving out the `value` field,
// so we inline our own response type here in order to let things decode correctly
type (
	simulateTransactionResponse = prize_pool.SimulateTransactionResponse
	simulateTransactionValue = prize_pool.SimulateTransactionValue
	simulateTransactionAccount = prize_pool.SimulateTransactionAccount
)

// GetTvl retrieves the current total value locked from chain using a simulated transaction
func GetTvl(rpcUrl string, fluidityPubkey, tvlDataPubkey, solendPubkey, obligationPubkey, reservePubkey, pythPubkey, switchboardPubkey solana.PublicKey, payer *solana.Wallet) (uint64, error) {
	params := getTvlTransactionParams(
		fluidityPubkey,
		tvlDataPubkey,
		solendPubkey,
		obligationPubkey,
		reservePubkey,
		pythPubkey,
		switchboardPubkey,
		payer,
	)

	client := rpc.New(rpcUrl)

	response := new(simulateTransactionResponse)

	// solana-go has the response type wrong, so we manually call the method
	// and decode into our own response type
	err := client.RPCCallForInto(
		context.Background(),
		response,
		"simulateTransaction",
		params,
	)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to simulate logtvl transaction: %v",
			err,
		)
	}

	value := response.Value

	if err := prize_pool.HandleTransactionError(value); err != nil {
		return 0, err
	}

	tvlAccount := new(tvlDataAccount)

	err = decodeAccountData(value.Accounts[0], tvlAccount)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to decode account data: %v",
			err,
		)
	}

	return tvlAccount.Tvl, nil
}

func decodeAccountData(data simulateTransactionAccount, out interface{}) error {
	dataBase64 := data.Data[0]

	dataBinary, err := base64.StdEncoding.DecodeString(dataBase64)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode account data from base64!"
			k.Payload = err
		})
	}

	err = borsh.Deserialize(out, dataBinary)

	if err != nil {
		return fmt.Errorf(
			"failed to borsh deserialise: %v",
			err,
		)
	}

	return nil
}

func getTvlTransactionParams(fluidityPubkey, tvlDataPubkey, solendPubkey, obligationPubkey, reservePubkey, pythPubkey, switchboardPubkey solana.PublicKey, payerAccount *solana.Wallet) []interface{} {
	accounts := solana.AccountMetaSlice{
		solana.NewAccountMeta(tvlDataPubkey, true, false),
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

	payer := solana.TransactionPayer(payerAccount.PublicKey())

	transaction, err := solana.NewTransaction(
		[]solana.Instruction{instruction},
		solana.Hash{},
		payer,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create logtvl transaction!"
			k.Payload = err
		})
	}

	_, err = transaction.Sign(func(pk solana.PublicKey) *solana.PrivateKey {
		if payerAccount.PublicKey().Equals(pk) {
			return &payerAccount.PrivateKey
		}

		return nil
	})

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to sign transaction!"
			k.Payload = err
		})
	}

	transactionBinary, err := transaction.MarshalBinary()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to marshal transaction!"
			k.Payload = err
		})
	}

	transactionBase64 := base64.StdEncoding.EncodeToString(transactionBinary)

	opts := map[string]interface{}{
		"sigVerify":              false,
		"commitment":             "finalized",
		"encoding":               "base64",
		"replaceRecentBlockhash": true,
		"accounts": map[string]interface{}{
			"encoding": "base64",
			"addresses": []string{
				tvlDataPubkey.String(),
			},
		},
	}

	params := []interface{}{
		transactionBase64,
		opts,
	}

	return params
}
