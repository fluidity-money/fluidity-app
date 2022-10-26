// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"crypto/ecdsa"
	"encoding/json"
	"fmt"
	"math"
	"math/big"
	"math/rand"
	"strings"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/util"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
)

func generateRandomIntegers(amount, min, max int) []int {
	if amount > max-min+1 {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Can't generate %d non-repeating integers between %d and %d!",
				amount,
				min,
				max,
			)
		})
	}

	numbers := make([]int, amount)

	for i := 0; i < amount; i++ {
		for {
			numbers[i] = min + rand.Intn(max)

			dup := false

			for j := 0; j < i; j++ {
				if numbers[i] == numbers[j] {
					dup = true
				}
			}

			if !dup {
				break
			}
		}
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

func weiToUsd(wei, usdPrice, ethDecimals *big.Rat) *big.Rat {
	res := new(big.Rat)

	res.Quo(wei, ethDecimals)
	res.Mul(wei, usdPrice)

	return res
}

func roundUp(x float64) uint64 {
	return uint64(math.Ceil(x))
}

func anyEthereumAddressesEmpty(addresses ...ethereum.Address) bool {
	for _, s := range addresses {
		if s == ethereum.Address("") {
			return true
		}
	}

	return false
}

func anyStringsEmpty(strings ...string) bool {
	for _, s := range strings {
		if s == "" {
			return true
		}
	}

	return false
}

// mustEthereumAddressFromEnv to convert an env to an ethereum address,
// or fatal if it's invalid
func mustEthereumAddressFromEnv(env string) ethCommon.Address {
	addressString := util.GetEnvOrFatal(env)

	if !ethCommon.IsHexAddress(addressString) {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to convert %v to an ethereum address!",
				addressString,
			)
		})
	}

	return ethCommon.HexToAddress(addressString)
}

func sendEmission(emission *worker.Emission) {
	emission.Update()

	queue.SendMessage(worker.TopicEmissions, emission)

	log.Debugf("Emission: %s", emission)
}

func concatenatePastTransfers(blocks []uint64, transactionCounts []int) string {
	var buf strings.Builder

	for i, block := range blocks {
		fmt.Fprintf(&buf, "%v:%v,", block, transactionCounts[i])
	}

	return buf.String()
}
