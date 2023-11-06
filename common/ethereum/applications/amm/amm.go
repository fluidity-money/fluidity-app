package amm

import (
	"fmt"
	"math/big"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/ethereum/amm"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

// FIXME
var ammSwap1LogTopic = amm.AmmAbi.Events["Swap1"].ID.String()
var ammSwap2LogTopic = amm.AmmAbi.Events["Swap2"].ID.String()

func GetAmmFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidContractAddress ethCommon.Address, tokenDecimals int) (feeData applications.ApplicationFeeData, appData applications.ApplicationData, err error) {

	if len(transfer.Log.Topics) < 1 {
		err = fmt.Errorf("Not enough log topics passed!")
		return
	}

	logTopic := transfer.Log.Topics[0].String()

	switch logTopic {
	case ammSwap1LogTopic:
		return handleSwap1(transfer, client, fluidContractAddress, tokenDecimals)
	case ammSwap2LogTopic:
		return handleSwap2(transfer, client, fluidContractAddress, tokenDecimals)
	default:
		return
	}
}

func handleSwap1(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidContractAddress ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, applications.ApplicationData, error) {
	swapData, err := amm.DecodeSwap1(transfer.Log)

	if err != nil {
		return applications.ApplicationFeeData{}, applications.ApplicationData{}, fmt.Errorf(
			"Failed to decode swap1 data! %w",
			err,
		)
	}

	_ = swapData

	fee := applications.ApplicationFeeData{
		Fee:    big.NewRat(0, 1),
		Volume: big.NewRat(0, 1),
	}
	appData := applications.ApplicationData{
		AmmPrices: applications.ApplicationDataAmm{
			FirstToken: ethereum.AddressFromString("0x1"),
			FirstTick:  3,
		},
	}
	return fee, appData, nil
}

func handleSwap2(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidContractAddress ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, applications.ApplicationData, error) {
	fee := applications.ApplicationFeeData{
		Fee:    big.NewRat(0, 1),
		Volume: big.NewRat(0, 1),
	}
	appData := applications.ApplicationData{
		AmmPrices: applications.ApplicationDataAmm{
			FirstToken:  ethereum.AddressFromString("0x1"),
			FirstTick:   3,
			SecondToken: ethereum.AddressFromString("0x2"),
			SecondTick:  2,
		},
	}

	return fee, appData, nil
}
