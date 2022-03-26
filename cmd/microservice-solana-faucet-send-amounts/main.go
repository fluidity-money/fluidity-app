package main

import (
	"os"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/faucet"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/solana/fluidity"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

const (
	// EnvSolanaRpcUrl to use to connect to a Solana node
	EnvSolanaRpcUrl = "FLU_SOLANA_RPC_URL"

	// EnvSolanaTokenAddress to use as the underlying token when sending
	EnvSolanaTokenAddress = "FLU_SOLANA_PROGRAM_ID"

	// EnvSolanaPrivateKey to use when signing transactions on Solana
	EnvSolanaPrivateKey = "FLU_SOLANA_FAUCET_PRIVATE_KEY"

	// EnvSolanaSenderPdaAddress to use to send faucet funds from
	EnvSolanaSenderPdaAddress = "FLU_SOLANA_FAUCET_SENDER_ADDR"

	// EnvSolanaDebugFakePayouts to prevent sending amounts when set to true
	EnvSolanaDebugFakePayouts = "FLU_SOLANA_DEBUG_FAKE_PAYOUTS"
)

func main() {
	var (
		solanaRpcUrl   = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		tokenAddress_  = util.GetEnvOrFatal(EnvSolanaTokenAddress)
		privateKey_    = util.GetEnvOrFatal(EnvSolanaPrivateKey)
		senderAddress_ = util.GetEnvOrFatal(EnvSolanaSenderPdaAddress)

		testingEnabled = os.Getenv(EnvSolanaDebugFakePayouts) == "true"
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
		senderAddress = solana.MustPublicKeyFromBase58(senderAddress_)
		tokenAddress = solana.MustPublicKeyFromBase58(tokenAddress_)
	)

	faucet.FaucetRequests(func (faucetRequest faucet.FaucetRequest) {
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

		if testingEnabled {
			log.App(func(k *log.Log) {
				k.Format(
					"Would've sent %v to %v, but in testing mode!",
					recipientAddress,
					amountInt64,
				)
			})

			return
		}

		signature, err := fluidity.SendTransfer(
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
