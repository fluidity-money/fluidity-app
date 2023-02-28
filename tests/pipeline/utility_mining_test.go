package main_test

import (
	"context"
	"crypto/ecdsa"
	"errors"
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
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/tests/pipeline/libtest"
	"github.com/stretchr/testify/assert"
)

const (
    // EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
    EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

    EnvEthereumSeedPhrase = `FLU_ETHEREUM_SEED_PHRASE`

    EnvOperatorContractAddress = `FLU_ETHEREUM_OPERATOR_CONTRACT_ADDR`
    EnvFluidTokenAddress       = `FLU_ETHEREUM_FLUID_TOKEN_ADDR`
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


func TestPipelineUtilityMining(t *testing.T) {

    var (
        gethUrl            = util.GetEnvOrFatal(EnvEthereumHttpUrl)
        seedPhrase         = util.GetEnvOrFatal(EnvEthereumSeedPhrase)
        tokenAddressString = util.GetEnvOrFatal(EnvFluidTokenAddress)
    )

    workerOut := libtest.LogMessages("util-mining-worker-server-out")
    spoolerOut := libtest.LogMessages("spooler-out")
    winnersOut := libtest.LogMessages("winners.ethereum")

    // wait until the other microservices have been brought up
    time.Sleep(5 * time.Second)

    wallet := libtest.NewWalletFromSeed(seedPhrase)

    var (
        tokenAddress = common.HexToAddress(tokenAddressString)
        fromAddress = libtest.RandomGethAddress()
        fromAddressString = ethereum.ConvertGethAddress(fromAddress).String()
        toAddress   = libtest.RandomGethAddress()
        toAddressString = ethereum.ConvertGethAddress(toAddress).String()

        _    /* deployer */         = wallet.Next()
        _    /* council */          = wallet.Next()
        _    /* oracle */           = wallet.Next()
        _    /* externalOperator */ = wallet.Next()
        user                        = wallet.Next()
    )

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

    transferTxn, err := callTransferFunction(client, userPrikey, tokenAddress, fromAddress, toAddress, big.NewInt(2e6))

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
            transferTxn.Hash().String(),
        )
    })

    var announcements []worker.EthereumAnnouncement
    err = workerOut.GetMessage(&announcements)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "No message on worker server queue!"
            k.Payload = err
        })
    }

    assert.Equal(t, 1, len(announcements), "wrong number of announcements!")

    // set randomSource so we always have 1 ball winning
    randomN := len(announcements[0].RandomSource)
    for i := range announcements[0].RandomSource {
        announcements[0].RandomSource[i] = uint32(randomN + 1)
    }

    announcements[0].RandomSource[0] = 0

    queue.SendMessage("worker-client-in", announcements)

    var spooledRewards worker.EthereumSpooledRewards
    err = spoolerOut.GetMessage(&spooledRewards)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "No message on spooler queue!"
            k.Payload = err
        })
    }

    transferReceipt, err := bind.WaitMined(context.Background(), client, transferTxn)

    assert.Equal(t, transferReceipt.BlockNumber, &spooledRewards.FirstBlock.Int)
    assert.Equal(t, transferReceipt.BlockNumber, &spooledRewards.LastBlock.Int)

    fluidRewards, exists := spooledRewards.Rewards[applications.UtilityFluid]
    assert.Equal(t, true, exists)
    testClientRewards, exists := spooledRewards.Rewards["testClient"]
    assert.Equal(t, true, exists)

    assert.Equal(t, 2, len(fluidRewards))
    assert.Equal(t, 2, len(testClientRewards))

    fluidRewardSender, exists := fluidRewards[ethereum.ConvertGethAddress(fromAddress)]
    assert.Equal(t, true, exists)
    libtest.AssertNotZero(t, fluidRewardSender, "fluid reward sender")

    fluidRewardRecipient, exists := fluidRewards[ethereum.ConvertGethAddress(toAddress)]
    assert.Equal(t, true, exists)
    libtest.AssertNotZero(t, fluidRewardRecipient, "fluid reward recipient")

    utilRewardSender, exists := testClientRewards[ethereum.ConvertGethAddress(fromAddress)]
    assert.Equal(t, true, exists)
    libtest.AssertNotZero(t, utilRewardSender, "utility reward sender")

    utilRewardRecipient, exists := testClientRewards[ethereum.ConvertGethAddress(toAddress)]
    assert.Equal(t, true, exists)
    libtest.AssertNotZero(t, utilRewardRecipient, "utility reward recipient")

    var winner winners.Winner
    var allWinners []winners.Winner
    for {
        err = winnersOut.GetMessage(&winner)

        if errors.Is(err, libtest.ErrNoMessages) {
            break
        }

        assert.Equal(t, err, nil)

        allWinners = append(allWinners, winner)
    }

    assert.Equal(t, len(allWinners), 4)

    type rewardsFound struct {
        fluid bool
        utility bool
    }
    var (
        senderFound    rewardsFound
        recipientFound rewardsFound
    )

    for _, winner := range allWinners {
        var userRewards *rewardsFound

        switch winner.WinnerAddress {
        case fromAddressString:
            userRewards = &senderFound
        case toAddressString:
            userRewards = &recipientFound
        default:
            t.Errorf("Unexpected address in win log! %s", winner.WinnerAddress)
            continue
        }

        switch winner.Utility {
        case applications.UtilityFluid:
            userRewards.fluid = true
        case "testClient":
            userRewards.utility = true
        default:
            t.Errorf("Unexpected utility in win log! %s", winner.Utility)
        }
    }

    assert.Equal(t, true, senderFound.fluid, "Fluid reward to sender not found")
    assert.Equal(t, true, senderFound.utility, "Utility reward to sender not found")
    assert.Equal(t, true, recipientFound.fluid, "Fluid reward to recipient not found")
    assert.Equal(t, true, recipientFound.utility, "Utility reward to recipient not found")
}
