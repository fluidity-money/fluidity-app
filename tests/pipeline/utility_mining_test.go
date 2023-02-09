package main_test

import (
	"crypto/ecdsa"
	"fmt"
	"math/big"
	"strings"
	"testing"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/tests/pipeline/libtest"
)

const (
    // EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
    EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

    EnvEthereumSeedPhrase = `FLU_ETHEREUM_SEED_PHRASE`

    EnvOperatorContractAddress = `FLU_ETHEREUM_OPERATOR_CONTRACT_ADDR`
    EnvFluidTokenAddress       = `FLU_ETHEREUM_UTIL_TOKEN_ADDR`
    EnvUtilityClientAddress    = `FLU_ETHEREUM_UTIL_CLIENT_ADDR`
)

var tokenAbi abi.ABI

const abiString = `[
    {
      "inputs": [
        { "internalType": "address", "name": "from", "type": "address" },
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "uint256", "name": "value", "type": "uint256" }
      ],
      "name": "transfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]`

func init() {
    reader := strings.NewReader(abiString)
    var err error

    tokenAbi, err = abi.JSON(reader)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to parse abi from string!"
            k.Payload = err
        })
    }
}

func callTransferFunction(ethClient *ethclient.Client, prikey *ecdsa.PrivateKey, tokenAddress, fromAddress, toAddress common.Address, amount *big.Int) (*types.Transaction, error) {
    boundContract := bind.NewBoundContract(
        tokenAddress,
        tokenAbi,
        ethClient,
        ethClient,
        ethClient,
    )

    transactionOptions, err := ethereum.NewTransactionOptions(ethClient, prikey)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to construct transaction options!"
            k.Payload = err
        })
    }

    transaction, err := ethereum.MakeTransaction(
        boundContract,
        transactionOptions,
        "transfer",
        fromAddress,
        toAddress,
        amount,
    )

    if err != nil {
        return nil, fmt.Errorf(
            "failed to call the transfer function on the fake utility client! %v",
            err,
        )
    }

    return transaction, nil
}


func TestUtilityMining(t *testing.T) {

    var (
        gethUrl            = util.GetEnvOrFatal(EnvEthereumHttpUrl)
        seedPhrase         = util.GetEnvOrFatal(EnvEthereumSeedPhrase)
        tokenAddressString = util.GetEnvOrFatal(EnvFluidTokenAddress)
    )

    appsOut := libtest.LogMessages("util-mining-apps-server-out")
    workerOut := libtest.LogMessages("util-mining-worker-server-out")

    time.Sleep(5 * time.Second) // dont look at this

    wallet := libtest.NewWalletFromSeed(seedPhrase)

    var (
        tokenAddress = common.HexToAddress(tokenAddressString)
        fromAddress = libtest.RandomGethAddress()
        toAddress   = libtest.RandomGethAddress()

        _ /* deployer */ = wallet.Next()
        council          = wallet.Next()
        oracle           = wallet.Next()
        externalOperator = wallet.Next()
        user             = wallet.Next()

        _ = council
        _ = oracle
        _ = externalOperator
    )

    log.Debug(func(k *log.Log) {
        k.Format(
            "council %s oracle %s externalop %s user %s",
            council.Address.String(),
            oracle.Address.String(),
            externalOperator.Address.String(),
            user.Address.String(),
        )
    })

    userPrikey, err := wallet.PrivateKey(user)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to get a private key of the derived user account!"
            k.Payload = err
        })
    }

    client, err := ethclient.Dial(gethUrl)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to connect to geth!"
            k.Payload = err
        })
    }

    tx, err := callTransferFunction(client, userPrikey, tokenAddress, fromAddress, toAddress, big.NewInt(2e6))

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to call the fake transfer function!"
            k.Payload = err
        })
    }

    log.Debug(func(k *log.Log) {
        k.Format(
            "Called the fake transfer function from %s to %s with hash %s!",
            fromAddress.String(),
            toAddress.String(),
            tx.Hash().String(),
        )
    })

    var block worker.EthereumHintedBlock
    err = appsOut.GetMessage(&block)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "No message on queue!"
            k.Payload = err
        })
    }

    log.Debug(func(k *log.Log) {
        k.Format(
            "apps server out %+v",
            block,
        )
    })




    var announcements []worker.EthereumAnnouncement
    err = workerOut.GetMessage(&announcements)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "No message on queue!"
            k.Payload = err
        })
    }

    log.Debug(func(k *log.Log) {
        k.Format(
            "worker server out %+v",
            announcements,
        )
    })
}
