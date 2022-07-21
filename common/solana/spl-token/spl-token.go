// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package spl_token

import (
	"context"
	"fmt"

	solLib "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"

	"github.com/near/borsh-go"
)

const (
	// VariantTransfer to transfer an amount to a user
	VariantTransfer = 3

	// VariantMintTo to mint tokens to a user
	VariantMintTo = 7

	// VariantBurn to burn tokens from a user
	VariantBurn = 8

	// VariantTransferChecked to transfer an amount,
	// verifying the expected token decimals
	VariantTransferChecked = 12
)

const (
	// TokenProgramAddress to use as the SPL token
	TokenProgramAddress = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"

	// TokenAssociatedProgramAddress used to create accounts
	TokenAssociatedProgramAddress = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
)

var (
	// TokenProgramAddressPubkey
	TokenProgramAddressPubkey = solLib.MustPublicKeyFromBase58(TokenProgramAddress)

	// TokenAssociatedProgramAddressPubkey
	TokenAssociatedProgramAddressPubkey = solLib.MustPublicKeyFromBase58(
		TokenAssociatedProgramAddress,
	)
)

type (
	// InstructionTransfer generally used with VariantTransfer to send amounts
	InstructionTransfer struct {
		Variant uint8
		Amount  uint64
	}
)

// SendTransfer using the token address given, the sender address, returning
// the signature or an error
func SendTransfer(solanaClient *solanaRpc.Client, senderPdaAddress, recipientAddress, tokenMintAddress solLib.PublicKey, amount uint64, recentBlockHash solLib.Hash, ownerPublicKey solLib.PublicKey, ownerPrivateKey solLib.PrivateKey) (string, error) {

	var (
		senderAccountMeta = solLib.NewAccountMeta(senderPdaAddress, true, false)
		signerAccountMeta = solLib.NewAccountMeta(ownerPublicKey, true, true)
		tokenMintMeta     = solLib.NewAccountMeta(tokenMintAddress, true, false)
	)

	programAddressInput := [][]byte{
		recipientAddress[:],
		TokenProgramAddressPubkey[:],
		tokenMintAddress[:],
	}

	ataRecipientPublicKey, _, err := solLib.FindProgramAddress(
		programAddressInput,
		TokenAssociatedProgramAddressPubkey,
	)

	if err != nil {
		return "", fmt.Errorf(
			"unable to derive the user's ATA key! %v",
			err,
		)
	}

	recipientAccountMeta := solLib.NewAccountMeta(ataRecipientPublicKey, true, false)

	_, err = solanaClient.GetAccountInfo(context.Background(), ataRecipientPublicKey)

	var instructions []solLib.Instruction

	if err != nil {
		createAccountSlice := solLib.AccountMetaSlice{
			signerAccountMeta,
			recipientAccountMeta,
			solLib.NewAccountMeta(recipientAddress, false, false),
			tokenMintMeta,
			solLib.NewAccountMeta(solLib.SystemProgramID, false, false),
			solLib.NewAccountMeta(TokenProgramAddressPubkey, false, false),
			solLib.NewAccountMeta(solLib.SysVarRentPubkey, false, false),
		}

		createAccountInstruction := solLib.NewInstruction(
			TokenAssociatedProgramAddressPubkey,
			createAccountSlice,
			[]byte{},
		)

		instructions = append(instructions, createAccountInstruction)
	}

	accountMetaSlice := solLib.AccountMetaSlice{
		senderAccountMeta,
		recipientAccountMeta,
		signerAccountMeta,
	}

	data := InstructionTransfer{
		Variant: VariantTransfer,
		Amount:  amount,
	}

	dataSerialised, err := borsh.Serialize(data)

	if err != nil {
		return "", fmt.Errorf(
			"Failed to serialise the data content to send out! %v",
			err,
		)
	}

	transferInstruction := solLib.NewInstruction(
		TokenProgramAddressPubkey,
		accountMetaSlice,
		dataSerialised,
	)

	instructions = append(instructions, transferInstruction)

	transaction, err := solLib.NewTransaction(instructions, recentBlockHash)

	if err != nil {
		return "", fmt.Errorf(
			"failed to make a new transaction with the instructions given and the block hash! %v",
			err,
		)
	}

	_, err = transaction.Sign(func(publicKey_ solLib.PublicKey) *solLib.PrivateKey {

		if ownerPublicKey.Equals(publicKey_) {
			return &ownerPrivateKey
		}

		return nil
	})

	if err != nil {
		return "", fmt.Errorf(
			"failed to sign the transaction using the user's private key! %v",
			err,
		)
	}

	signature, err := solanaClient.SendTransaction(context.Background(), transaction)

	if err != nil {
		return "", fmt.Errorf(
			"failed to send the transaction to Solana! %v",
			err,
		)
	}

	signatureString := fmt.Sprintf("%x", string(signature[:]))

	return signatureString, nil
}
