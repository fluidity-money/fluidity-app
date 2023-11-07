package amm

import (
	"fmt"
	"math"
	"math/big"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/ethereum/amm"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
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

	var (
		volumeInt = swapData.Amount1
		firstTick = swapData.FinalTick
		pool      = swapData.Pool
	)

	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	// amount 1 is the fluid token
	volume := new(big.Rat).SetInt(&volumeInt.Int)
	volume.Quo(volume, decimalsRat)

	fee := applications.ApplicationFeeData{
		// zero fee for now
		Fee:    big.NewRat(0, 1),
		Volume: volume,
	}

	appData := applications.ApplicationData{
		AmmPrices: applications.ApplicationDataAmm{
			FirstToken: pool,
			FirstTick:  firstTick,
		},
	}

	return fee, appData, nil
}

func handleSwap2(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidContractAddress ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, applications.ApplicationData, error) {
	swap2Data, err := amm.DecodeSwap2(transfer.Log)

	if err != nil {
		return applications.ApplicationFeeData{}, applications.ApplicationData{}, fmt.Errorf(
			"Failed to decode swap2 data! %w",
			err,
		)
	}

	var (
		fluidVolumeInt = swap2Data.FluidVolume
		firstToken     = swap2Data.From
		secondToken    = swap2Data.To
		firstTick      = swap2Data.FinalTick0
		secondTick     = swap2Data.FinalTick1
	)

	fluidVolumeRat := new(big.Rat).SetInt(&fluidVolumeInt.Int)

	// there's two fluid transfers with this volume per swap2
	fluidVolumeRat.Mul(fluidVolumeRat, big.NewRat(2, 1))

	fee := applications.ApplicationFeeData{
		// zero fee for now
		Fee:    big.NewRat(0, 1),
		Volume: fluidVolumeRat,
	}

	appData := applications.ApplicationData{
		AmmPrices: applications.ApplicationDataAmm{
			FirstToken:  firstToken,
			FirstTick:   firstTick,
			SecondToken: secondToken,
			SecondTick:  secondTick,
		},
	}

	return fee, appData, nil
}
