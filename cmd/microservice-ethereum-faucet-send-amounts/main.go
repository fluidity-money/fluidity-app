package main

import (
	"context"
	"os"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/faucet"
	faucetTypes "github.com/fluidity-money/fluidity-app/lib/types/faucet"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/common/ethereum"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	// EnvTokensList to relate the received token names to a contract address
	// of the form ADDR1:TOKEN1:DECIMALS1,ADDR2:TOKEN2:DECIMALS2,...
	EnvTokensList = "FLU_ETHEREUM_TOKENS_LIST"

	// EnvEthereumHttpUrl to use to connect to Geth to send amounts
	EnvEthereumHttpUrl = "FLU_ETHEREUM_HTTP_URL"

	// EnvPrivateKey to use when signing requests to send amount from the faucet
	EnvPrivateKey = "FLU_ETHEREUM_FAUCET_PRIVATE_KEY"

	// NullAddress to filter for to prevent it from blocking the thing
	NullAddress = "0x0000000000000000000000000000000000000000"

	// EnvGasLimit to use to manually set the gas limit on chains with bad
	// behaviour. Should be set to 8 million for Ropsten.
	EnvGasLimit = `FLU_ETHEREUM_GAS_LIMIT`

	// EnvUseHardhatFix instead of trying to guess the gas or set it manually
	EnvUseHardhatFix = `FLU_ETHEREUM_HARDHAT_FIX`
)

func main() {
	var (
		ethereumTokensList_ = util.GetEnvOrFatal(EnvTokensList)
		privateKey_         = util.GetEnvOrFatal(EnvPrivateKey)
		ethereumHttpAddress = util.GetEnvOrFatal(EnvEthereumHttpUrl)

		tokenAddresses = make(map[faucetTypes.FaucetSupportedToken]ethCommon.Address)

		useHardhatFix bool
		gasLimit      uint64 = 0
	)

	if os.Getenv(EnvUseHardhatFix) == "true" {
		useHardhatFix = true

		log.Debug(func(k *log.Log) {
			k.Message = "Using the hardhat gas fix!"
		})
	}

	if gasLimit_ := os.Getenv(EnvGasLimit); gasLimit_ != "" {
		var err error
		gasLimit, err = strconv.ParseUint(gasLimit_, 10, 64)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to parse hardcoded gas limit!"
				k.Payload = err
			})
		}
	}

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

	chainId, err := ethClient.ChainID(context.Background())

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to get the current chain id Geth!"
			k.Payload = err
		})
	}

	// populate map of token sessions for each token we're tracking

	tokensList_ := ethereum.GetTokensListEthereum(ethereumTokensList_)

	for _, details := range tokensList_ {

		tokenName_     := details.TokenName

		tokenName, err := faucetTypes.TokenFromString("f"+tokenName_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to convert token %#v to a supported token! %v",
					tokenName_,
					err,
				)
			})
		}

		tokenAddresses[tokenName] = details.FluidAddress
	}

	faucet.FaucetRequests(func(faucetRequest faucet.FaucetRequest) {
		var (
			address   = faucetRequest.Address
			amount    = faucetRequest.Amount
			network_  = faucetRequest.Network
			tokenName = faucetRequest.TokenName
		)

		if network_ != network.NetworkEthereum {
			return
		}

		if address == NullAddress || address == "" {
			return
		}

		// check for invalid token name
		if _, err := tokenName.TokenDecimals(); err != nil {
			return
		}

		var (
			tokenAddress = tokenAddresses[tokenName]
			ethAddress   = ethCommon.HexToAddress(address)
		)

		transferOpts, err := ethAbiBind.NewKeyedTransactorWithChainID(
			privateKey,
			chainId,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to create a new keyed constructor with chain id!"
				k.Payload = err
			})
		}

		transaction, err := callTransferFunction(
			ethClient,
			tokenAddress,
			ethAddress,
			&amount.Int,
			transferOpts,
			useHardhatFix,
			gasLimit,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to transfer an amount to %#v!",
					ethAddress.String(),
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
