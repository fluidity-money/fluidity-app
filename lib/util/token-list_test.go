package util

import (
	"math/big"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTokenList(t *testing.T) {
	var (
		ethereumTokensList_ = os.Getenv(`FLU_ETHEREUM_TOKENS_LIST`)

		expectedEthereumTokensList = []TokenDetailsBase{}
	)

	resultEthereumTokensList := GetTokensListBase(ethereumTokensList_)

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

	assert.Equal(t, expectedEthereumTokensList, resultEthereumTokensList)
}
