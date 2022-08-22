package probability

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	ProbabilityScale = 1000000000
	Decimals         = 1000000
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
func payout(atx, g, rewardPool, deltaWeight *big.Rat, winningClasses int, n, b int64, blockTime uint64, emission *worker.Emission) (payout *big.Rat, probability_ *big.Rat) {
	m := int64(winningClasses)

	blockTimeRat := new(big.Rat).SetUint64(blockTime)

	delta := new(big.Rat).Mul(blockTimeRat, rewardPool)

	delta.Quo(delta, deltaWeight)

	gTimesAtx := new(big.Rat).Mul(g, atx)

	mRat := ratFromInt64(m)

	a := new(big.Rat)

	// TODO: Check comparison logic
	if gTimesAtx.Cmp(delta) < 0 {

		a = new(big.Rat).Quo(g, mRat)

	} else {

		atxMulM := new(big.Rat).Mul(atx, mRat)

		a = new(big.Rat).Quo(delta, atxMulM)

	}

	p := probability(m, n, b)

	// a / p
	aDivP := new(big.Rat).Mul(
		a,
		new(big.Rat).Inv(p),
	)

	emission.Payout.Winnings, _ = aDivP.Float64()
	emission.Payout.P, _ = p.Float64()
	emission.Payout.A, _ = a.Float64()
	emission.Payout.M = m
	emission.Payout.G, _ = g.Float64()
	emission.Payout.B = b
	emission.Payout.Delta, _ = delta.Float64()
	emission.Payout.Atx, _ = atx.Float64()
	emission.Payout.BlockTime = blockTime
	emission.Payout.RewardPool, _ = rewardPool.Float64()

	return aDivP, p
}

func calculateN(winningClasses int, atx, payoutFreq *big.Rat, emission *worker.Emission) int64 {
	var (
		m = int64(winningClasses)
		n = int64(winningClasses + 1)
	)

	var (
		factorialN  = factorial(n)
		factorialM  = factorial(m)
		factorialNM = factorial(n - m)
	)

	factorial := new(big.Rat).Mul(factorialM, factorialNM)

	probabilityM := new(big.Rat).Mul(atx, factorial)

	emission.CalculateN.ProbabilityM, _ = probabilityM.Float64()
	emission.CalculateN.Factorial, _ = atx.Float64()

	// ATX * m! * (n-m)!
	// payout frequency defaults to 1/4

	p := new(big.Rat).Mul(
		payoutFreq,
		probabilityM,
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
func WinningChances(gasFee, atx, rewardPool, decimalPlacesRat, payoutFreq, deltaWeight *big.Rat, winningClasses, averageTransfersInBlock int, blockTimeInSeconds uint64, emission *worker.Emission) (winningTier uint, payouts []*misc.BigInt, probabilities []*big.Rat) {

	averageTransfersInBlock_ := intToRat(averageTransfersInBlock)

	n := calculateN(winningClasses, payoutFreq, atx, emission)

	payouts = make([]*misc.BigInt, winningClasses)

	probabilities = make([]*big.Rat, winningClasses)

	for i := 0; i < winningClasses; i++ {

		winningClass := int64(i + 1)

		payout, probability := payout(
			averageTransfersInBlock_,
			gasFee,
			rewardPool,
			deltaWeight,
			winningClasses,
			n,
			winningClass,
			blockTimeInSeconds,
			emission,
		)

		// set the emission for the payout before adjusting it
		// to be sent to the blockchain

		switch i {
		case 0: emission.WinningChances.Payout1, _ = payout.Float64()
		case 1: emission.WinningChances.Payout2, _ = payout.Float64()
		case 2: emission.WinningChances.Payout3, _ = payout.Float64()
		case 3: emission.WinningChances.Payout4, _ = payout.Float64()
		case 4: emission.WinningChances.Payout5, _ = payout.Float64()
		}

		// this is the payout that a user would receive! due to the way that
		// eth works!

		payout.Mul(payout, decimalPlacesRat)

		leftSide := new(big.Int).Quo(payout.Num(), payout.Denom())

		payoutBigInt := misc.NewBigInt(*leftSide)

		payouts[i] = &payoutBigInt
		probabilities[i] = probability
	}

	// set the emissions data for logging after the fact

	emission.WinningChances.Probability1, _ = probabilities[0].Float64()
	emission.WinningChances.Probability2, _ = probabilities[1].Float64()
	emission.WinningChances.Probability3, _ = probabilities[2].Float64()
	emission.WinningChances.Probability4, _ = probabilities[3].Float64()
	emission.WinningChances.Probability5, _ = probabilities[4].Float64()

	emission.WinningChances.AtxAtEnd, _ = atx.Float64()

	return uint(n), payouts, probabilities
}

// NaiveIsWinning examines the random numbers we drew and determines if we won
func NaiveIsWinning(balls []uint32, emission *worker.Emission) int {

	emission.NaiveIsWinning.TestingBalls = balls

	matchedBalls := 0

	// for each ball, if the ball's number is smaller than or equal
	// to the length of the balls, increase the matched balls by 1

	for _, i := range balls {
		if int(i) <= len(balls) {
			matchedBalls++
		}
	}

	emission.NaiveIsWinning.IsWinning = matchedBalls > 0

	emission.NaiveIsWinning.MatchedBalls = matchedBalls

	return matchedBalls
}
