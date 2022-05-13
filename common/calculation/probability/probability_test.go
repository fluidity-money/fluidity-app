package probability

import (
	"fmt"
	"math"
	"math/big"
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestFactorial(t *testing.T) {
	// negative
	assert.Panics(t, func() {
		factorial(-1)
	})

	// zero
	result := factorial(0)
	expected := big.NewRat(1, 1)
	assert.Equal(t, 0, result.Cmp(expected))

	// [1, 50]
	for i := int64(1); i <= 50; i++ {
		t.Run("Factorial_"+fmt.Sprint(i), func(t *testing.T) {
			// calculate factorial using function
			result := factorial(i)
			// set expected to running factorial sum
			expected.Mul(expected, big.NewRat(i, 1))

			// assert equality
			require.Equal(t, 0, result.Cmp(expected))
		})
	}
}

func TestNaiveIsWinning(t *testing.T) {
	emission := getTestEmission("ethereum", "usdt", 6)
	// number of balls <= len(balls)
	result := NaiveIsWinning([]uint32{5, 3, 1}, emission)
	assert.Equal(t, 2, result)

	result = NaiveIsWinning([]uint32{5, 8, 11}, emission)
	assert.Equal(t, 0, result)

	result = NaiveIsWinning([]uint32{5, 8, 6, 2}, emission)
	assert.Equal(t, 1, result)

	result = NaiveIsWinning([]uint32{5, 4, 3, 2, 1}, emission)
	assert.Equal(t, 5, result)
}

func TestProbability(t *testing.T) {
	var (
		m = int64(7)
		n = int64(86)
		b = int64(3)
	)

	// precomputed by wolfram alpha, according to the whitepaper with query:
	// m = 7, n = 86, b = 3, (((m choose b) * ((n - m) choose (m - b)))/(n choose m))
	expected := big.NewRat(10517507, 1074640176)

	result := probability(m, n, b)
	assert.Equal(t, expected, result)
}

func TestCalculateN(t *testing.T) {
	var (
		m = int64(8)
		g = big.NewRat(91, 1)
	)

	// n! < p over 1000 iterations panics
	atx := big.NewRat(math.MaxInt64, 1)
	atx.Num().Exp(atx.Num(), big.NewInt(6), nil)

	assert.PanicsWithValue(
		t,
		"infinite loop",
		func() {
			calculateN(m, g, atx, getTestEmission("ethereum", "usdt", 6))
		},
	)

	g = big.NewRat(3, 1)
	atx = big.NewRat(4728, 1)

	result := calculateN(m, g, atx, getTestEmission("ethereum", "usdt", 6))
	assert.EqualValues(t, 12, result)
}

func TestPayout(t *testing.T) {
	// use whitepaper example, and approximate p
	var (
		atx        = big.NewRat(36_500_000, 1)
		apy        = big.NewRat(35_000_000, 1)
		g          = big.NewRat(3, 1)
		m          = int64(6)
		n          = int64(1580)
		b          = int64(1)
		rewardPool = big.NewRat(0, 1)
		blockTime  = uint64(0)
	)

	result := payout(atx, apy, g, rewardPool, m, n, b, blockTime, getTestEmission("ethereum", "usdt", 6))
	// should be accurate to 2 decimal places, so trim then remove the last to avoid rounding
	rf := result.FloatString(3)
	trimmedResult := rf[:len(rf)-1]
	expected := "7.12"
	assert.Equal(t, expected, trimmedResult)

	// set low gas for mu > g case
	g = big.NewRat(1, 100)
	expectedRat := big.NewRat(71344570743089, 959979214533768)

	result = payout(atx, apy, g, rewardPool, m, n, b, blockTime, getTestEmission("ethereum", "usdt", 6))
	assert.Equal(t, expectedRat, result)
}

func TestWinningChances(t *testing.T) {
	var (
		gasFee                  = big.NewRat(3, 1)
		atx                     = big.NewRat(36_500_000, 1)
		bpyStakedUsd            = big.NewRat(150, 1)
		rewardPool              = big.NewRat(10, 1)
		decimalPlacesRat        = big.NewRat(6, 1)
		averageTransfersInBlock = 13
		blockTimeInSeconds      = uint64(15)
		crumb                   = getTestEmission("ethereum", "usdt", 6)

		expectedN       = uint(66)
		expectedPayouts = []*misc.BigInt{}
	)

	a := misc.BigIntFromInt64(12)
	b := misc.BigIntFromInt64(89)
	c := misc.BigIntFromInt64(1758)
	d := misc.BigIntFromInt64(105485)
	e := misc.BigIntFromInt64(32172940)

	expectedPayouts = append(expectedPayouts, &a)
	expectedPayouts = append(expectedPayouts, &b)
	expectedPayouts = append(expectedPayouts, &c)
	expectedPayouts = append(expectedPayouts, &d)
	expectedPayouts = append(expectedPayouts, &e)

	n, payouts := WinningChances(gasFee, atx, bpyStakedUsd, rewardPool, decimalPlacesRat, averageTransfersInBlock, blockTimeInSeconds, crumb)

	assert.Equal(t, expectedN, n)
	assert.Equal(t, expectedPayouts, payouts)
}
