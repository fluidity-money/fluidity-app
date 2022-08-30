package main

import (
	"os"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	"github.com/fluidity-money/fluidity-app/common/solana/spl-token"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/faucet"
	faucetTypes "github.com/fluidity-money/fluidity-app/lib/types/faucet"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"
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
	mintPubkey   solana.PublicKey
	pdaPubkey    solana.PublicKey
	signerWallet *solana.Wallet
}

type tokenMap map[faucetTypes.FaucetSupportedToken]faucetTokenDetails

func main() {
	var (
		solanaRpcUrl = util.PickEnvOrFatal(EnvSolanaRpcUrl)

		solanaTokenList_    = util.GetEnvOrFatal(EnvTokensList)
		accountDetailsList_ = util.GetEnvOrFatal(EnvSolanaAccountDetails)

		tokenDetails = make(tokenMap)

		testingEnabled = os.Getenv(EnvSolanaDebugFakePayouts) == "true"
	)

	solanaClient, err := rpc.New(solanaRpcUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the Solana RPC client!"
			k.Payload = err
		})
	}

	// populate map of token sessions for each token we're tracking

	tokenList_ := solana.GetTokensListSolana(solanaTokenList_)

	for _, details := range tokenList_ {

		var (
			mintPubkey = details.FluidMintPubkey
			tokenName_ = details.TokenName
		)

		tokenName, err := faucetTypes.TokenFromString("f" + tokenName_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to convert token %#v to a supported token! %v",
					tokenName_,
					err,
				)
			})
		}

		var details faucetTokenDetails
		details.mintPubkey = mintPubkey

		tokenDetails[tokenName] = details
	}

	tokenDetails.addAccountDetails(accountDetailsList_)

	faucet.FaucetRequests(func(faucetRequest faucet.FaucetRequest) {
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
				k.Message = "Failed to convert a faucet public key!"
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

		token := tokenDetails[tokenName]

		var (
			senderAddress    = token.signerWallet.PublicKey()
			senderPrivateKey = token.signerWallet.PrivateKey
			senderPdaAddress = token.pdaPubkey
			mintAddress      = token.mintPubkey
		)

		signature, err := spl_token.SendTransfer(
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
