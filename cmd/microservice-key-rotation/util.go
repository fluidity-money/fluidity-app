// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"bytes"
	"context"
	"crypto/ecdsa"
	"fmt"
	"io"
	"math/big"
	"strings"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

type OracleInfo struct {
	// contract address of the fluid token this oracle is for
	ContractAddress string
	// the AWS parameter key containing this oracle private key
	Parameter string
}

// oracleParametersListFromEnv to parse the AWS parameter names from the environment
func oracleParametersListFromEnv(env string) []OracleInfo {
	oracleParametersString := util.GetEnvOrFatal(EnvOracleParametersList)

	oracleParametersList_ := strings.Split(oracleParametersString, ",")
	numberOfTokens := len(oracleParametersList_)

	oracleParametersList := make([]OracleInfo, numberOfTokens)

	for i, oracle := range oracleParametersList_ {
		split := strings.Split(oracle, ":")

		if len(split) != 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to parse oracle from environment %v! Expected two parameters, had %v!",
					oracle,
					len(split),
				)
			})
		}

		var (
			contractAddress = split[0]
			parameter       = split[1]
		)

		oracleParametersList[i] = OracleInfo{
			ContractAddress: contractAddress,
			Parameter:       parameter,
		}
	}

	return oracleParametersList
}

// createAndSignSendTransaction to create, sign, and add to the signedTxnAttachments map
// a transaction that transfers the previous oracle's entire balance to the new oracle
func createAndSignSendTransaction(ethClient *ethclient.Client, previousOracleAddress, newOraclePublicKey, contractAddress ethCommon.Address, oldOraclePrivateKey *ecdsa.PrivateKey, signedTxnAttachments map[string]io.Reader) error {
	// fetch transaction parameters
	chainId, err := ethClient.ChainID(context.Background())

	if err != nil {
		return fmt.Errorf(
			"Failed to get the chain ID! %v",
			err,
		)
	}

	signer := types.NewLondonSigner(chainId)
	nonce, err := ethClient.PendingNonceAt(context.Background(), previousOracleAddress)

	if err != nil {
		return fmt.Errorf(
			"Failed to fetch the pending nonce for the existing oracle! %v",
			err,
		)
	}

	// use a higher nonce in case transactions are made before the worker is restarted
	nonce += 10

	accountBalance, err := ethClient.BalanceAt(context.Background(), previousOracleAddress, nil)
	if err != nil {
		return fmt.Errorf(
			"Failed to fetch latest account balance for the existing oracle! %v",
			err,
		)
	}

	suggetedTipCap, err := ethClient.SuggestGasTipCap(context.Background())

	if err != nil {
		return fmt.Errorf(
			"Failed to suggest the gas tip cap! %v",
			err,
		)
	}

	suggestedGasPrice, err := ethClient.SuggestGasPrice(context.Background())

	if err != nil {
		return fmt.Errorf(
			"Failed to suggest the gas price! %v",
			err,
		)
	}

	// default gas for a transfer
	gas := big.NewInt(21000)

	// accountBalance - gas * gasPrice
	gasFee := suggestedGasPrice.Mul(suggestedGasPrice, gas)
	value := accountBalance.Sub(accountBalance, gasFee)

	// create the transaction
	txData := types.DynamicFeeTx{
		ChainID:   chainId,
		Nonce:     nonce,
		Gas:       gas.Uint64(),
		GasTipCap: suggetedTipCap,
		GasFeeCap: suggetedTipCap,
		To:        &newOraclePublicKey,
		Value:     value,
	}

	// sign the transaction
	signedTxn, err := types.SignNewTx(oldOraclePrivateKey, signer, txData)

	if err != nil {
		return fmt.Errorf(
			"failed to sign the transaction to update the oracles! %v",
			err,
		)
	}

	// convert to hex and add to attachments
	marshalled_, err := signedTxn.MarshalBinary()

	if err != nil {
		return fmt.Errorf(
			"failed to marshal the signed transaction to binary! %v",
			err,
		)
	}

	marshalled := ethCommon.Bytes2Hex(marshalled_)
	txnReader := bytes.NewReader([]byte("0x" + marshalled))
	contractAddressString := contractAddress.String()

	attachmentName := "signed_transaction_" + contractAddressString
	signedTxnAttachments[attachmentName] = txnReader

	return nil
}
