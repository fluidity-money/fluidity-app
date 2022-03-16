package probability

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log/breadcrumb"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
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
func payout(atx, apy, g, rewardPool *big.Rat, m, n, b int64, blockTime uint64, crumb *breadcrumb.Breadcrumb) *big.Rat {

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

	crumb.Set(func(k *breadcrumb.Breadcrumb) {
		k.Many(map[string]interface{}{
			"p":           p.FloatString(10),
			"a":           a.FloatString(10),
			"m":           m,
			"g":           g.FloatString(10),
			"b":           b,
			"delta":       delta.FloatString(10),
			"apy + delta": apyPlusDelta.FloatString(10),
			"atx":         atx.FloatString(10),
			"apy":         apy.FloatString(10),
			"bpy for staked usd inside payout function": apy.FloatString(10),
			"block time":  blockTime,
			"reward pool": rewardPool.FloatString(10),
		})
	})

	// a / p
	aDivP := new(big.Rat).Mul(
		a,
		p.Inv(p),
	)

	return aDivP
}

func calculateN(m int64, g, atx *big.Rat, crumb *breadcrumb.Breadcrumb) int64 {
	n := int64(m + 1)

	var (
		factorialN  = factorial(n)
		factorialM  = factorial(m)
		factorialNM = factorial(n - m)
	)

	factorial := new(big.Rat).Mul(factorialM, factorialNM)

	probabilityM := new(big.Rat).Mul(atx, factorial)

	crumb.Set(func(k *breadcrumb.Breadcrumb) {
		k.Many(map[string]interface{}{
			"calculateN->probabilityM": probabilityM.FloatString(10),
			"calculateN->factorial":    atx.FloatString(10),
		})
	})

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

	crumb.Set(func(k *breadcrumb.Breadcrumb) {
		k.Many(map[string]interface{}{
			"calculate N atx":    atx.FloatString(10),
			"n after calculateN": n,
		})
	})

	return n
}

// n, payouts[]
func WinningChances(gasFee, atx, bpyStakedUsd, rewardPool, decimalPlacesRat *big.Rat, averageTransfersInBlock int, blockTimeInSeconds uint64, crumb *breadcrumb.Breadcrumb) (uint, []*misc.BigInt) {

	var (
		averageTransfersInBlock_ = intToRat(averageTransfersInBlock)
		winningClasses           = int64(WinningClasses)
	)

	n := calculateN(winningClasses, gasFee, atx, crumb)

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
			crumb,
		)

		// this is the payout that a user would receive! due to the way that
		// eth works!

		payout.Mul(payout, decimalPlacesRat)

		leftSide := new(big.Int).Quo(payout.Num(), payout.Denom())

		changed := new(big.Rat).Quo(payout, decimalPlacesRat)

		crumb.Set(func(k *breadcrumb.Breadcrumb) {
			payoutKey := fmt.Sprintf("payout number %v", i)

			payoutMessage := fmt.Sprintf(
				"payout %v = %v : %v",
				i,
				payout.FloatString(10),
				leftSide.String(),
			)

			changedKey := fmt.Sprintf("payout adjusted to appear normal %v", i)

			k.One(payoutKey, payoutMessage)

			k.One(changedKey, changed.FloatString(10))
		})

		payoutBigInt := misc.NewBigInt(*leftSide)
		payouts = append(payouts, &payoutBigInt)
	}

	crumb.Set(func(k *breadcrumb.Breadcrumb) {
		k.One("atx at end", atx.FloatString(10))
	})

	return uint(n), payouts
}

// NaiveIsWinning examines the random numbers we drew and determines if we won
func NaiveIsWinning(balls []uint32, crumb *breadcrumb.Breadcrumb) int {

	crumb.Set(func(k *breadcrumb.Breadcrumb) {
		k.One("testing balls", balls)
	})

	matchedBalls := 0

	for _, i := range balls {
		if int(i) <= len(balls) {
			matchedBalls = matchedBalls + 1
		}
	}

	return matchedBalls
}
