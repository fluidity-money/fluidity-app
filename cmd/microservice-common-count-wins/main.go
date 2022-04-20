package main

import (
	"math/big"
	"time"
	"os"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/past-winnings"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

const (
	// EnvEthereumTokensList to use for tokens in the Ethereum world
	EnvEthereumTokensList = `FLU_ETHEREUM_TOKENS_LIST`

	// EnvSolanaTokensList to use for tokens in the Solana world
	EnvSolanaTokensList = `FLU_SOLANA_TOKENS_LIST`
)

func calculateAndStoreTotalWinners(network network.BlockchainNetwork, tokens map[string]*big.Int, date time.Time) {
	var (
		cumulativeWinnersCount  uint64 = 0
		cumulativeWinningAmount        = new(big.Int)
	)

	for tokenName, tokenDecimals := range tokens {
		winners, winningAmount_ := winners.CountWinnersForDateAndWinningAmount(
			network,
			tokenName,
			date,
		)

		cumulativeWinnersCount += winners

		winningAmountInt := new(big.Int).Div(&winningAmount_.Int, tokenDecimals)

		cumulativeWinningAmount.Add(cumulativeWinningAmount, winningAmountInt)
	}

	cumulativeWinningAmountBigInt := misc.NewBigInt(*cumulativeWinningAmount)

	pastWinnings := past_winnings.PastWinnings{
		Network:         network,
		WinningDate:     date,
		AmountOfWinners: cumulativeWinnersCount,
		WinningAmount:   cumulativeWinningAmountBigInt,
	}

	past_winnings.InsertPastWinnings(pastWinnings)
}

func main() {
	var (
		ethereumTokensList_ = os.Getenv(EnvEthereumTokensList)
		solanaTokensList_   = os.Getenv(EnvSolanaTokensList)
	)

	ethereumTokensList, err := tokensListToMap(ethereumTokensList_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert the Ethereum tokens to a map!"
			k.Payload = err
		})
	}

	solanaTokensList, err := tokensListToMap(solanaTokensList_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert the solana tokens to a map!"
			k.Payload = err
		})
	}

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

	calculateAndStoreTotalWinners(
		network.NetworkEthereum,
		ethereumTokensList,
		yesterday,
	)

	calculateAndStoreTotalWinners(
		network.NetworkSolana,
		solanaTokensList,
		yesterday,
	)
}
