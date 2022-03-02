package main

import (
	"encoding/json"
	"bytes"
	"io"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/faucet"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/lib/queue"

	"github.com/fluidity-money/microservice-solana-faucet-send-amounts/lib"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

const (
	// EnvSolanaRpcUrl to use to connect to a Solana node
	EnvSolanaRpcUrl = "FLU_SOLANA_RPC_URL"

	// EnvSolanaTokenAddress to use as the underlying token when sending
	EnvSolanaTokenAddress = "FLU_SOLANA_TOKEN_ADDRESS"

	// EnvSolanaPrivateKey to use when signing transactions on Solana
	EnvSolanaPrivateKey = "FLU_SOLANA_FAUCET_PRIVATE_KEY"
)

func main() {
	var (
		solanaRpcUrl  = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		tokenAddress_ = util.GetEnvOrFatal(EnvSolanaTokenAddress)
		privateKey_   = util.GetEnvOrFatal(EnvSolanaPrivateKey)
	)

	solanaClient := solanaRpc.New(solanaRpcUrl)

	payer, err := solana.WalletFromPrivateKeyBase58(privateKey_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer private key!"
			k.Payload = err
		})
	}

	var (
		privateKey = payer.PrivateKey
		publicKey  = payer.PublicKey()
	)

	// HARDCODED!

	senderAddress := solana.MustPublicKeyFromBase58("9nQXJm1rupcbgaPgX9xxPToszoV6bBAjWxG4cK89Bdap")

	tokenAddress, err := solana.PublicKeyFromBase58(tokenAddress_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to read the token address %#v from the string!",
				tokenAddress,
			)

			k.Payload = err
		})
	}

	queue.GetMessages(faucet.TopicFaucetRequest, func(message queue.Message) {

		var buf bytes.Buffer

		if _, err := io.Copy(&buf, message.Content); err != nil {
			panic(err)
		}

		buf2 := buf

		log.App(func(k *log.Log) {
			k.Format("Message off the queue is %v", string(buf.Bytes()))
		})

		var faucetRequest faucet.FaucetRequest

		if err := json.NewDecoder(&buf2).Decode(&faucetRequest); err != nil {
			panic(err)
		}

		var (
			address_ = faucetRequest.Address
			amount   = faucetRequest.Amount
			network_ = faucetRequest.Network
		)

		if network_ != network.NetworkSolana {
			return
		}

		if address_ == "" {
			return
		}

		recipientAddress, err := solana.PublicKeyFromBase58(address_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get the public key from the recipient address of %v!",
					address_,
				)

				k.Payload = err
			})
		}

		blockHash, err := getBlockHash(solanaClient)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get the latest block hash from Solana!"
				k.Payload = err
			})
		}

		amountInt64 := amount.Uint64()

		signature, err := microservice_solana_faucet_send_amounts.SendTransfer(
			solanaClient,
			senderAddress,
			recipientAddress,
			tokenAddress,
			amountInt64,
			*blockHash,
			publicKey,
			privateKey,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to send a transfer!"
				k.Payload = err
			})
		}

		log.App(func(k *log.Log) {
			k.Format(
				"Sent a transfer to %#v, amount %#v with signature",
				recipientAddress,
				amount,
			)

			k.Payload = signature
		})
	})
}
