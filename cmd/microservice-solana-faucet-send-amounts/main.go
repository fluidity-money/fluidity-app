package main

import (
	"os"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/faucet"
	faucetTypes "github.com/fluidity-money/fluidity-app/lib/types/faucet"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/solana/fluidity"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

const (
	// EnvTokensList to relate the received token names to a contract address
	// of the form ADDR1:TOKEN1:DECIMALS1:...,ADDR2:TOKEN2:DECIMALS2...,...
	EnvTokensList = "FLU_SOLANA_TOKENS_LIST"

	// EnvSolanaRpcUrl to use to connect to a Solana node
	EnvSolanaRpcUrl = "FLU_SOLANA_RPC_URL"

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
		tokenList_     = util.GetEnvOrFatal(EnvTokensList)
		privateKey_    = util.GetEnvOrFatal(EnvSolanaPrivateKey)
		senderAddress_ = util.GetEnvOrFatal(EnvSolanaSenderPdaAddress)

		tokenAddresses = make(map[faucetTypes.FaucetSupportedToken]solana.PublicKey)

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
	)

	// populate map of token sessions for each token we're tracking

	tokenList := strings.Split(tokenList_, ",")

	for _, token_ := range tokenList {

		tokenSeparated := strings.Split(token_, ":")

		// either have the two used fields, or the form including Solend keys, etc.
		if len(tokenSeparated) < 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to separate %#v, expected format ADDRESS:TOKEN:...",
					token_,
				)
			})
		}

		mintPubkey, err := solana.PublicKeyFromBase58(tokenSeparated[0])

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to convert address %#v to a public key! %v",
					tokenSeparated[0],
					err,
				)
			})
		}

		baseTokenName := tokenSeparated[1]

		tokenName, err := faucetTypes.TokenFromString("f"+baseTokenName)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to convert token %#v to a supported token! %v",
					tokenSeparated[1],
					err,
				)
			})
		}

		tokenAddresses[tokenName] = mintPubkey
	}
	
	faucet.FaucetRequests(func (faucetRequest faucet.FaucetRequest) {
		var (
			address_  = faucetRequest.Address
			amount    = faucetRequest.Amount
			network_  = faucetRequest.Network
			tokenName = faucetRequest.TokenName
		)

		if network_ != network.NetworkSolana {
			return
		}

		if address_ == "" {
			return
		}

		// check for invalid token name

		if _, err := tokenName.TokenDecimals(); err != nil {
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
					"Would've sent %v %v to %v, but in testing mode!",
					amountInt64,
					tokenName,
					recipientAddress,
				)
			})

			return
		}

		fluidMintAddress := tokenAddresses[tokenName]

		signature, err := fluidity.SendTransfer(
			solanaClient,
			senderAddress,
			recipientAddress,
			fluidMintAddress,
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
