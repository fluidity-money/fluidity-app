package main

import (
	"math/big"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/past-winnings"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func main() {
	today := time.Now()

	yesterday := time.Date(
		today.Year(),
		today.Month(),
		today.Day()-1,
		0,
		0,
		0,
		0,
		today.Location(),
	)

	winners, winningAmount_ := winners.CountWinnersForDateAndWinningAmount(
		network.NetworkEthereum,
		yesterday,
	)

	winningAmountInt := new(big.Int).Div(&winningAmount_.Int, big.NewInt(1e6))

	winningAmount := misc.NewBigInt(*winningAmountInt)

	pastWinnings := past_winnings.PastWinnings{
		Network:         network.NetworkEthereum,
		WinningDate:     yesterday,
		AmountOfWinners: winners,
		WinningAmount:   winningAmount,
	}

	past_winnings.InsertPastWinnings(pastWinnings)
}
