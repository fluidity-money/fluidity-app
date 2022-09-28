package aave

import (
	"testing"
	"math/big"
)

func TestSafeQuo1(t *testing.T) {
	x := big.NewRat(0, 1)
	y := big.NewRat(10, 10)
	safeQuo(x, y)
}

func TestSafeQuo2(t *testing.T) {
	x := big.NewRat(10000, 2)
	y := big.NewRat(112810, 1990)
	safeQuo(x, y)
}
