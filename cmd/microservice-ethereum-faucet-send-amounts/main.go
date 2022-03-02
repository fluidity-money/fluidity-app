package main

import (
	"context"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/faucet"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	ethBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/microservice-ethereum-faucet-send-amounts/lib/contract"
)

const (
	// EnvContractAddress to use the transfer function on
	EnvContractAddress = "FLU_ETHEREUM_CONTRACT_ADDR"

	// EnvEthereumHttpUrl to use to connect to Geth to send amounts
	EnvEthereumHttpUrl = "FLU_ETHEREUM_HTTP_URL"

	// EnvPrivateKey to use when signing requests to send amount from the faucet
	EnvPrivateKey = "FLU_ETHEREUM_FAUCET_PRIVATE_KEY"

	// NullAddress to filter for to prevent it from blocking the thing
	NullAddress = "0x0000000000000000000000000000000000000000"
)

func main() {
	var (
		ethereumContractAddress_ = util.GetEnvOrFatal(EnvContractAddress)
		privateKey_              = util.GetEnvOrFatal(EnvPrivateKey)
		ethereumHttpAddress      = util.GetEnvOrFatal(EnvEthereumHttpUrl)
	)

	ethereumContractAddress := ethCommon.HexToAddress(ethereumContractAddress_)

	privateKey, err := ethCrypto.HexToECDSA(privateKey_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert the private key passed to a private key!"
			k.Payload = err
		})
	}

	ethClient, err := ethclient.Dial(ethereumHttpAddress)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to dial into Geth!"
			k.Payload = err
		})
	}

	token, err := contract.NewToken(ethereumContractAddress, ethClient)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create a new token session for the Fluid token!"
			k.Payload = err
		})
	}

	chainId, err := ethClient.ChainID(context.Background())

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to get the current chain id Geth!"
			k.Payload = err
		})
	}

	transferOpts, err := ethBind.NewKeyedTransactorWithChainID(
		privateKey,
		chainId,
	)

	tokenSession := contract.TokenSession{
		Contract:     token,
		TransactOpts: *transferOpts,
	}

	faucet.FaucetRequests(func(faucetRequest faucet.FaucetRequest) {
		var (
			address  = faucetRequest.Address
			amount   = faucetRequest.Amount
			network_ = faucetRequest.Network
		)

		if network_ != network.NetworkEthereum {
			return
		}

		if address == NullAddress || address == "" {
			return
		}

		ethAddress := ethCommon.HexToAddress(address)

		transaction, err := tokenSession.Transfer(ethAddress, &amount.Int)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to transfer an amount to %#v!",
					address,
				)

				k.Payload = err
			})
		}

		var transactionHash string

		if transaction != nil {
			transactionHash = transaction.Hash().Hex()
		}

		log.App(func(k *log.Log) {
			k.Format(
				"Sent %v to %#v! Transaction hash %#v!",
				amount,
				address,
				transactionHash,
			)
		})
	})
}
