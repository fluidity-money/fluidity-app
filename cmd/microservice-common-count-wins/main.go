package main

import (
	"math/big"
	"os"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/past-winnings"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvEthereumTokensList to use for tokens in the Ethereum world
	EnvEthereumTokensList = `FLU_ETHEREUM_TOKENS_LIST`

	// EnvSolanaTokensList to use for tokens in the Solana world
	EnvSolanaTokensList = `FLU_SOLANA_TOKENS_LIST`
)

func calculateAndStoreTotalWinners(network network.BlockchainNetwork, tokens []util.TokenDetailsBase, date time.Time) {
	var (
		cumulativeWinnersCount  uint64 = 0
		cumulativeWinningAmount        = new(big.Int)
	)

	for _, tokenDetails := range tokens {

		var (
			tokenName      = tokenDetails.TokenName
			tokenDecimals_ = tokenDetails.TokenDecimals
			tokenDecimals  = new(big.Int).Set(tokenDecimals_.Num())
		)

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

	var ethereumTokensList, solanaTokensList []util.TokenDetailsBase

	if ethereumTokensList_ != "" {
		ethereumTokensList = util.GetTokensListBase(ethereumTokensList_)
	}

	if solanaTokensList_ != "" {
		solanaTokensList = util.GetTokensListBase(solanaTokensList_)
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
