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

	// EnvSolanaAccountDetails to find token PDAs and associated owner private keys
	// of the form PDA1:TOKEN1:PRIKEY1,PDA2:TOKEN2:PRIKEY2,...
	EnvSolanaAccountDetails = "FLU_SOLANA_FAUCET_ACCOUNT_DETAILS"

	// EnvSolanaDebugFakePayouts to prevent sending amounts when set to true
	EnvSolanaDebugFakePayouts = "FLU_SOLANA_DEBUG_FAKE_PAYOUTS"
)

type faucetTokenDetails struct {
	mintPubkey solana.PublicKey;
	pdaPubkey solana.PublicKey;
	signerWallet *solana.Wallet;
}

func main() {
	var (
		solanaRpcUrl   = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		tokenList_     = util.GetEnvOrFatal(EnvTokensList)
		accountDetailsList_ = util.GetEnvOrFatal(EnvSolanaAccountDetails)

		tokenAddresses = make(map[faucetTypes.FaucetSupportedToken]faucetTokenDetails)

		testingEnabled = os.Getenv(EnvSolanaDebugFakePayouts) == "true"
	)

	solanaClient := solanaRpc.New(solanaRpcUrl)

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

		mintPubkey := solana.MustPublicKeyFromBase58(tokenSeparated[0])

		baseTokenName := tokenSeparated[1]

		tokenName, err := faucetTypes.TokenFromString("f"+baseTokenName)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to convert token %#v to a supported token! %v",
					baseTokenName,
					err,
				)
			})
		}

		var tokenDetails faucetTokenDetails
		tokenDetails.mintPubkey = mintPubkey

		tokenAddresses[tokenName] = tokenDetails
	}

	accountDetailsList := strings.Split(accountDetailsList_, ",")

	for _, account_ := range accountDetailsList {
		accountSeparated := strings.Split(account_, ":")

		if len(accountSeparated) != 3 {
			log.Fatal(func (k *log.Log) {
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
		    log.Fatal(func (k *log.Log) {
		        k.Format(
					"Failed to create a wallet for %s!",
					tokenName,
				)

		        k.Payload = err
		    })
		}

		details, ok := tokenAddresses[tokenName]

		if !ok {
			log.Fatal(func (k *log.Log) {
			    k.Format(
					"Token %s has account details but not token details!",
					tokenName,
				)
			})
		}

		details.pdaPubkey = pdaPubkey
		details.signerWallet = wallet

		tokenAddresses[tokenName] = details
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

		var (
			senderAddress = fluidMintAddress.signerWallet.PublicKey()
			senderPrivateKey = fluidMintAddress.signerWallet.PrivateKey
			senderPdaAddress = fluidMintAddress.pdaPubkey
			mintAddress = fluidMintAddress.mintPubkey
		)

		signature, err := fluidity.SendTransfer(
			solanaClient,
			senderPdaAddress,
			recipientAddress,
			mintAddress,
			amountInt64,
			*blockHash,
			senderAddress,
			senderPrivateKey,
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
