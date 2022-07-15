package util

import (
	"math/big"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTokenList(t *testing.T) {
	var (
		expectedEthereumTokensList = []TokenDetailsBase{}
		expectedSolanaTokensList   = []TokenDetailsBase{}
	)

	resultEthereumTokensList := GetTokensListBase(os.Getenv(`FLU_ETHEREUM_TOKENS_LIST`))
	resultSolanaTokensList := GetTokensListBase(os.Getenv(`FLU_SOLANA_TOKENS_LIST`))

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

	assert.Equal(t, expectedSolanaTokensList, resultSolanaTokensList)
	assert.Equal(t, expectedEthereumTokensList, resultEthereumTokensList)
}
