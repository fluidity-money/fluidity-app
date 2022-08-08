package main

import (
	"math/big"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/past-winnings"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

const (
	// EnvEthereumTokensList to use for tokens in the Ethereum world
	EnvEthereumTokensList = `FLU_ETHEREUM_TOKENS_LIST`

	// EnvSolanaTokensList to use for tokens in the Solana world
	EnvSolanaTokensList = `FLU_SOLANA_TOKENS_LIST`
)

// SupportedNetworks in the database existing
var SupportedNetworks = []network.BlockchainNetwork{
	network.NetworkEthereum,
	network.NetworkSolana,
}

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

	for _, network := range SupportedNetworks {
		var (
			cumulativeWinnersCount  uint64  = 0
			cumulativeWinningAmount float64 = 0
		)

		tokens := winners.GetUniqueTokens(network)

		for _, tokenDetails := range tokens {

			var (
				tokenName     = tokenDetails.TokenName
				tokenDecimals = tokenDetails.TokenDecimals
			)

			winners, winningAmount_ := winners.CountWinnersForDateAndWinningAmount(
				network,
				tokenName,
				yesterday,
			)

			cumulativeWinnersCount += winners

			winningAmountRat := new(big.Rat).SetInt(&winningAmount_.Int)

			winningAmountRat.Quo(winningAmountRat, tokenDecimals)

			winningAmountFloat, _ := winningAmountRat.Float64()

			cumulativeWinningAmount += winningAmountFloat
		}

		pastWinnings := past_winnings.PastWinnings{
			Network:         network,
			WinningDate:     yesterday,
			AmountOfWinners: cumulativeWinnersCount,
			WinningAmount:   cumulativeWinningAmount,
		}

		past_winnings.InsertPastWinnings(pastWinnings)
	}
}
