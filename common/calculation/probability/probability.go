package probability

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	ProbabilityScale = 1000000000
	Decimals         = 1000000
	WinningClasses   = 5
)

func factorial(n int64) *big.Rat {
	if n < 0 {
		panic("Tried to calculate the factorial of a negative number!")
	}

	int := new(big.Int).MulRange(1, n)

	var r big.Rat

	return r.SetInt(int)
}

func probability(m, n, b int64) *big.Rat {

	mulLeftSide := new(big.Int).Binomial(m, b)

	mulRightSide := new(big.Int).Binomial(n-m, m-b)

	fracLeftSide := new(big.Int).Mul(mulLeftSide, mulRightSide)

	fracRightSide := new(big.Int).Binomial(n, m)

	probability := new(big.Rat).SetFrac(fracLeftSide, fracRightSide)

	return probability
}

// A / p(b)
func payout(atx, apy, g, rewardPool *big.Rat, m, n, b int64, blockTime uint64, emission *worker.Emission) *big.Rat {

	blockTimeRat := new(big.Rat).SetUint64(blockTime)

	delta := new(big.Rat).Mul(blockTimeRat, rewardPool)

	delta.Quo(delta, big.NewRat(31536000, 1))

	gTimesAtx := new(big.Rat).Mul(g, atx)

	mRat := ratFromInt64(m)

	a := new(big.Rat)

	apyPlusDelta := new(big.Rat).Add(apy, delta)

	if gTimesAtx.Cmp(apyPlusDelta) < 0 {

		a = new(big.Rat).Quo(g, mRat)

	} else {

		atxMulM := new(big.Rat).Mul(atx, mRat)

		a = new(big.Rat).Quo(apyPlusDelta, atxMulM)

	}

	p := probability(m, n, b)

	emission.Payout.P, _ = p.Float64()
	emission.Payout.A, _ = a.Float64()
	emission.Payout.M = m
	emission.Payout.G, _ = g.Float64()
	emission.Payout.B = b
	emission.Payout.Delta, _ = delta.Float64()
	emission.Payout.ApyPlusDelta, _ = apyPlusDelta.Float64()
	emission.Payout.Atx, _ = atx.Float64()
	emission.Payout.Apy, _ = apy.Float64()
	emission.Payout.BpyForStakedUsd, _ = apy.Float64()
	emission.Payout.BlockTime = blockTime
	emission.Payout.RewardPool, _ = rewardPool.Float64()

	// a / p
	aDivP := new(big.Rat).Mul(
		a,
		p.Inv(p),
	)

	return aDivP
}

func calculateN(m int64, g, atx *big.Rat, emission *worker.Emission) int64 {
	n := int64(m + 1)

	var (
		factorialN  = factorial(n)
		factorialM  = factorial(m)
		factorialNM = factorial(n - m)
	)

	factorial := new(big.Rat).Mul(factorialM, factorialNM)

	probabilityM := new(big.Rat).Mul(atx, factorial)

	emission.CalculateN.ProbabilityM, _ = probabilityM.Float64()
	emission.CalculateN.Factorial, _ = atx.Float64()

	p := new(big.Rat).Mul(
		big.NewRat(1, 4), // 1/4
		probabilityM,     // ATX * m! * (n-m)!
	)

	var i = 1

	// while n! < p
	for factorialN.Cmp(p) == -1 {
		i += 1
		if i > 1000 {
			panic("infinite loop")
		}

		n += 1

		p = new(big.Rat).Mul(p, big.NewRat(n-m, 1))

		factorialN = new(big.Rat).Mul(factorialN, big.NewRat(n, 1))
	}

	n = n - 1

	emission.CalculateN.Atx, _ = atx.Float64()
	emission.CalculateN.N = n

	return n
}

// n, payouts[]
func WinningChances(gasFee, atx, bpyStakedUsd, rewardPool, decimalPlacesRat *big.Rat, averageTransfersInBlock int, blockTimeInSeconds uint64, emission *worker.Emission) (uint, []*misc.BigInt) {

	var (
		averageTransfersInBlock_ = intToRat(averageTransfersInBlock)
		winningClasses           = int64(WinningClasses)
	)

	n := calculateN(winningClasses, gasFee, atx, emission)

	payouts := make([]*misc.BigInt, 0)

	for i := int64(1); i < WinningClasses+1; i++ {

		payout := payout(
			averageTransfersInBlock_,
			bpyStakedUsd,
			gasFee,
			rewardPool,
			WinningClasses,
			n,
			i,
			blockTimeInSeconds,
			emission,
		)

		// this is the payout that a user would receive! due to the way that
		// eth works!

		payout.Mul(payout, decimalPlacesRat)

		leftSide := new(big.Int).Quo(payout.Num(), payout.Denom())

		payoutBigInt := misc.NewBigInt(*leftSide)
		payouts = append(payouts, &payoutBigInt)
	}

	emission.WinningChances.AtxAtEnd, _ = atx.Float64()

	return uint(n), payouts
}

// NaiveIsWinning examines the random numbers we drew and determines if we won
func NaiveIsWinning(balls []uint32, emission *worker.Emission) int {

	emission.NativeIsWinning.TestingBalls = balls

	matchedBalls := 0

	for _, i := range balls {
		if int(i) <= len(balls) {
			matchedBalls = matchedBalls + 1
		}
	}

	return matchedBalls
}
