package util

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTokenList(t *testing.T) {
	const (
		ExpectedTokensListEthereum = `:USDT:6,:USDC:6,:DAI:18,:TUSD:18,:FEI:18,:FRAX:18,:UST:6`
		ExpectedTokensListSolana   = `:USDT:6,:USDC:6,:UXD:6,:UST:6`
	)

	var (
		expectedEthereumTokensList = []TokenDetailsBase{}
		expectedSolanaTokensList   = []TokenDetailsBase{}
	)

	resultEthereumTokensList := GetTokensListBase(ExpectedTokensListEthereum)
	resultSolanaTokensList := GetTokensListBase(ExpectedTokensListSolana)

	expectedEthereumTokensList = append(expectedEthereumTokensList, TokenDetailsBase{
		TokenName:     `USDT`,
		TokenDecimals: big.NewRat(1000000, 1),
	})
	expectedEthereumTokensList = append(expectedEthereumTokensList, TokenDetailsBase{
		TokenName:     `USDC`,
		TokenDecimals: big.NewRat(1000000, 1),
	})
	expectedEthereumTokensList = append(expectedEthereumTokensList, TokenDetailsBase{
		TokenName:     `DAI`,
		TokenDecimals: big.NewRat(1000000000000000000, 1),
	})
	expectedEthereumTokensList = append(expectedEthereumTokensList, TokenDetailsBase{
		TokenName:     `TUSD`,
		TokenDecimals: big.NewRat(1000000000000000000, 1),
	})
	expectedEthereumTokensList = append(expectedEthereumTokensList, TokenDetailsBase{
		TokenName:     `FEI`,
		TokenDecimals: big.NewRat(1000000000000000000, 1),
	})
	expectedEthereumTokensList = append(expectedEthereumTokensList, TokenDetailsBase{
		TokenName:     `FRAX`,
		TokenDecimals: big.NewRat(1000000000000000000, 1),
	})
	expectedEthereumTokensList = append(expectedEthereumTokensList, TokenDetailsBase{
		TokenName:     `UST`,
		TokenDecimals: big.NewRat(1000000, 1),
	})

	expectedSolanaTokensList = append(expectedSolanaTokensList, TokenDetailsBase{
		TokenName:     `USDC`,
		TokenDecimals: big.NewRat(1000000, 1),
	})
	expectedSolanaTokensList = append(expectedSolanaTokensList, TokenDetailsBase{
		TokenName:     `USDT`,
		TokenDecimals: big.NewRat(1000000, 1),
	})
	expectedSolanaTokensList = append(expectedSolanaTokensList, TokenDetailsBase{
		TokenName:     `UXD`,
		TokenDecimals: big.NewRat(1000000, 1),
	})
	expectedSolanaTokensList = append(expectedSolanaTokensList, TokenDetailsBase{
		TokenName:     `UST`,
		TokenDecimals: big.NewRat(1000000, 1),
	})

	assert.ElementsMatch(t, expectedSolanaTokensList, resultSolanaTokensList)
	assert.ElementsMatch(t, expectedEthereumTokensList, resultEthereumTokensList)
}
