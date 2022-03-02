package main

import (
	"crypto/ecdsa"
	"encoding/json"
	"math"
	"math/big"
	"math/rand"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
)

func generateRandomIntegers(amount, min, max int) []int {
	numbers := make([]int, amount)

	for i := 0; i < amount; i++ {
		numbers[i] = min + rand.Intn(max)
	}

	return numbers
}

func hexToPrivateKey(hex string) *ecdsa.PrivateKey {
	privateKey, err := ethCrypto.HexToECDSA(hex)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert the private key from hex!"
			k.Payload = err
		})
	}

	return privateKey
}

func bigFloatFromInt(x *big.Int) *big.Float {
	var float big.Float

	return float.SetInt(x)
}

func debug(format string, arguments ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Format(format, arguments...)
	})
}

// getLastBlockTime by asking Redis for it
func getLastBlockTimestamp() int64 {
	blockTime_ := state.Get("block.time")

	if len(blockTime_) == 0 {
		return 0
	}

	var blockTime time.Time

	if err := json.Unmarshal(blockTime_, &blockTime); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to unmarshal the block time to a time.Time representation!"
			k.Payload = err
		})
	}

	blockTimeSeconds := int64(blockTime.Unix())

	return blockTimeSeconds
}

func newWholeRat(x int64) *big.Rat {
	var rat big.Rat

	return rat.SetInt64(x)
}

func uint64ToRat(x uint64) *big.Rat {
	var rat big.Rat

	return rat.SetUint64(x)
}

func bigRatFromInt(x *big.Int) *big.Rat {
	var rat big.Rat

	return rat.SetInt(x)
}

func privateKeyToAddress(privateKey *ecdsa.PrivateKey) ethCommon.Address {
	publicKey := privateKey.Public().(*ecdsa.PublicKey)

	publicKeyAddress := ethCrypto.PubkeyToAddress(*publicKey)

	return publicKeyAddress
}

func bigIntToRat(x misc.BigInt) *big.Rat {
	var r big.Rat

	return r.SetInt(&x.Int)
}

func hexToAddress(s ethereum.Address) ethCommon.Address {
	return ethCommon.HexToAddress(s.String())
}

func bigPow(left *big.Rat, count int) *big.Rat {

	leftCopy_ := *left
	leftCopy := &leftCopy_

	leftOriginal_ := *left
	leftOriginal := &leftOriginal_

	for i := 1; i < count; i++ {
		leftCopy = new(big.Rat).Mul(leftCopy, leftOriginal)
	}

	return leftCopy
}

func exponentiate(x int) *big.Rat {
	ten := big.NewRat(10, 1)

	return bigPow(ten, x)
}

func roundUp(x float64) uint64 {
	return uint64(math.Ceil(x))
}
