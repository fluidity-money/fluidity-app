package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	faucetTypes "github.com/fluidity-money/fluidity-app/lib/types/faucet"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

func getBlockHash(client *solanaRpc.Client) (*solana.Hash, error) {
	blockHashResult, err := client.GetRecentBlockhash(context.Background(), "finalized")

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get the most recent block hash! %v",
			err,
		)
	}

	if blockHashResult == nil {
		return nil, nil
	}

	blockHash := blockHashResult.Value.Blockhash

	return &blockHash, nil
}

// addAccountDetails to parse the env PDAs and private keys and add them to the map
func (tokenDetails tokenMap) addAccountDetails(accountDetailsList_ string) {
	accountDetailsList := strings.Split(accountDetailsList_, ",")

	for _, account_ := range accountDetailsList {
		accountSeparated := strings.Split(account_, ":")

		if len(accountSeparated) != 3 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Invalid account details! Expected the form PDA:NAME:PRIKEY, got %s!",
					accountSeparated,
				)
			})
		}

		pdaPubkey := solana.MustPublicKeyFromBase58(accountSeparated[0])

		baseTokenName := accountSeparated[1]

		tokenName, err := faucetTypes.TokenFromString("f" + baseTokenName)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to convert token %#v to a supported token! %v",
					baseTokenName,
					err,
				)
			})
		}

		wallet, err := solana.WalletFromPrivateKeyBase58(accountSeparated[2])

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to create a wallet for %s!",
					tokenName,
				)

				k.Payload = err
			})
		}

		details, ok := tokenDetails[tokenName]

		if !ok {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Token %s has account details but not token details!",
					tokenName,
				)
			})
		}

		details.pdaPubkey = pdaPubkey
		details.signerWallet = wallet

		tokenDetails[tokenName] = details
	}
}
