package solend

import (
	"context"
	"fmt"
	solana "github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
	"math/big"
)

type (
	Decimal struct {
		One uint64
		Two uint64
	}

	LastUpdate struct {
		Slot  uint64
		Stale bool
	}

	ReserveLiquidity struct {
		MintPubkey               solana.PublicKey
		MintDecimals             uint8
		SupplyPubkey             solana.PublicKey
		PythOraclePubkey         solana.PublicKey
		SwitchboardOraclePubkey  solana.PublicKey
		AvailableAmount          uint64
		BorrowedAmountWads       Decimal
		CumulativeBorrowRateWads Decimal
		MarketPrice              Decimal
	}

	ReserveCollateral struct {
		MintPubkey      solana.PublicKey
		MintTotalSupply uint64
		SupplyPubkey    solana.PublicKey
	}

	ReserveFees struct {
		BorrowFeeWad      uint64
		FlashLoanFeeWad   uint64
		HostFeePercentage uint8
	}

	ReserveConfig struct {
		OptimalUtilizationRate uint8
		LoanToValueRatio       uint8
		LiquidationBonus       uint8
		LiquidationThreshold   uint8
		MinBorrowRate          uint8
		OptimalBorrowRate      uint8
		MaxBorrowRate          uint8
		Fees                   ReserveFees
		DepositLimit           uint64
		BorrowLimit            uint64
		FeeReceiver            solana.PublicKey
	}

	Reserve struct {
		Version       uint8
		LastUpdate    LastUpdate
		LendingMarket solana.PublicKey
		Liquidity     ReserveLiquidity
		Collateral    ReserveCollateral
		Config        ReserveConfig
	}
)

func (d Decimal) ToInt() *big.Int {
	byteString := fmt.Sprintf("%b%064b", d.Two, d.One)
	newInt := new(big.Int)
	newInt.SetString(byteString, 2)
	return newInt
}

func (reserve Reserve) CalculateSupplyAPY() *big.Rat {
	currentUtilization := reserve.CalculateUtilizationRatio()

	borrowAPY := reserve.CalculateBorrowAPY()

	supplyApy := new(big.Rat).Mul(currentUtilization, borrowAPY)

	supplyApy.Mul(supplyApy, big.NewRat(100, 1))

	return supplyApy
}

func (reserve Reserve) CalculateUtilizationRatio() *big.Rat {
	// get the borrowed amount
	borrowedAmountInt := reserve.Liquidity.BorrowedAmountWads.ToInt()

	// convert to rat with correct scale by dividing by 10^18
	borrowedAmount := new(big.Rat).SetInt(borrowedAmountInt)
	borrowedAmount.Quo(borrowedAmount, big.NewRat(1e18, 1))

	availableAmountUint64 := reserve.Liquidity.AvailableAmount

	availablePlusBorrowedAmount := new(big.Rat).SetUint64(availableAmountUint64)
	availablePlusBorrowedAmount.Add(availablePlusBorrowedAmount, borrowedAmount)

	// borrowedAmount / availableAmount + borrowedAmount
	utilizationRatio := new(big.Rat).Quo(borrowedAmount, availablePlusBorrowedAmount)

	return utilizationRatio
}

func (reserve Reserve) CalculateBorrowAPY() *big.Rat {
	currentUtilization := reserve.CalculateUtilizationRatio()
	// optimalUtilization = OptimalUtilizationRate / 100
	optimalUtilization := big.NewRat(int64(reserve.Config.OptimalUtilizationRate), 100)

	optimalUtilizationIsOne := optimalUtilization == big.NewRat(1, 1)

	currentUtilizationLTOptimalUtilization := currentUtilization.Cmp(optimalUtilization) == -1

	borrowAPY := new(big.Rat)

	if optimalUtilizationIsOne || currentUtilizationLTOptimalUtilization {
		normalizedFactor := new(big.Rat).Quo(currentUtilization, optimalUtilization)

		optimalBorrowRate := big.NewRat(int64(reserve.Config.OptimalBorrowRate), 100)
		minBorrowRate := big.NewRat(int64(reserve.Config.MinBorrowRate), 100)

		optimalBorrowRateSubMinBorrowRate := new(big.Rat).Sub(optimalBorrowRate, minBorrowRate)

		borrowAPY.Mul(normalizedFactor, optimalBorrowRateSubMinBorrowRate)
		borrowAPY.Add(borrowAPY, minBorrowRate)
	} else {
		currentUtilizationSubOptimalUtilization := new(big.Rat).Sub(
			currentUtilization,
			optimalUtilization,
		)

		oneSubOptimalUtilization := new(big.Rat).Sub(big.NewRat(1, 1), optimalUtilization)

		// (currentUtilization - optimalUtilization) / (1 - optimalUtilization)
		normalizedFactor := new(big.Rat).Quo(
			currentUtilizationSubOptimalUtilization,
			oneSubOptimalUtilization,
		)

		optimalBorrowRate := big.NewRat(int64(reserve.Config.OptimalBorrowRate), 100)
		maxBorrowRate := big.NewRat(int64(reserve.Config.MaxBorrowRate), 100)

		maxBorrowRateSubOptimalBorrowRate := new(big.Rat).Sub(maxBorrowRate, optimalBorrowRate)

		borrowAPY.Mul(normalizedFactor, maxBorrowRateSubOptimalBorrowRate)
		borrowAPY.Add(borrowAPY, optimalBorrowRate)
	}
	return borrowAPY
}

func GetUsdApy(solanaClient *rpc.Client, reservePubkey solana.PublicKey) (*big.Rat, error) {
	// get reserve bytes
	resp, err := solanaClient.GetAccountInfo(
		context.TODO(),
		reservePubkey,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get reserve account with pubkey %#v! %v",
			reservePubkey,
			err,
		)
	}

	// deserialise reserve bytes
	reserve := new(Reserve)
	err = borsh.Deserialize(reserve, resp.Value.Data.GetBinary())

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to deserialize reserve data! %v",
			err,
		)
	}

	return reserve.CalculateSupplyAPY(), nil
}
