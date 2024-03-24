package main

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/sui-go-sdk/models"
	"github.com/fluidity-money/sui-go-sdk/sui"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

const (
	// MistDecimalPlaces to be mindful of when tracking fees paid
	MistDecimalPlaces = 1e9
)

func mustMapFromInterface(m interface{}) map[string]interface{} {
	m_, ok := m.(map[string]interface{})

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to coerce interface to map[string]interface{}!"
			k.Payload = m
		})
	}

	return m_
}

// f is an interface{} containing a float64
func mustIntFromFloat64Interface(f interface{}) int {
	f_, ok := f.(float64)

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to coerce interface to int!"
			k.Payload = f
		})
	}

	return int(f_)
}

func mustValueFromMapKey(m interface{}, key string) interface{} {
	return mustMapFromInterface(m)[key]
}

func mustIntFromMapKey(m interface{}, key string) int {
	return mustIntFromFloat64Interface(mustValueFromMapKey(m, key))
}

func mustArrayFromInterface(m interface{}) []interface{} {
	m_, ok := m.([]interface{})

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to coerce interface to []interface{}!"
			k.Payload = m
		})
	}

	return m_
}

func mustStringFromInterface(s interface{}) string {
	s_, ok := s.(string)

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to coerce interface string!"
			k.Payload = s
		})
	}

	return s_
}

func getSuiGasFee(suiClient sui.ISuiAPI, suiPythPubkey string, gasUsed models.GasCostSummary) (*big.Rat, error) {
	var (
		computationFee_ = gasUsed.ComputationCost
		storageFee_     = gasUsed.StorageCost
		storageRebate_  = gasUsed.StorageRebate
	)

	mistDecimalPlacesRat := big.NewRat(MistDecimalPlaces, 1)

	// sui gas fee is computation fee + storage fee - rebate, in MIST (9 decimals)
	gasFee, ok := new(big.Rat).SetString(computationFee_)
	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert computation fee to bigint!"
			k.Payload = computationFee_
		})
	}
	storageFee, ok := new(big.Rat).SetString(storageFee_)
	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert storage fee to bigint!"
			k.Payload = storageFee_
		})
	}
	storageRebate, ok := new(big.Rat).SetString(storageRebate_)
	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to convert storage rebate to bigint!"
			k.Payload = storageRebate_
		})
	}

	gasFee.Add(gasFee, storageFee)
	gasFee.Sub(gasFee, storageRebate)

	gasFee.Quo(gasFee, mistDecimalPlacesRat)

	// normalise to usd
	suiPrice, err := getPythPrice(suiClient, suiPythPubkey)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get the sui-USD price from pyth! %v",
			err,
		)
	}

	gasFee.Mul(gasFee, suiPrice)

	return gasFee, nil
}

// TODO obtain the price from pyth rather than hardcoding
const SuiPrice = 2000000000 // in MIST
func getPythPrice(client sui.ISuiAPI, pythPubkey string) (*big.Rat, error) {
	gasFee := new(big.Rat).SetInt64(SuiPrice)
	return gasFee, nil
}
