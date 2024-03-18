package main

import (
	"fmt"
	"math/big"

	"github.com/block-vision/sui-go-sdk/models"
	"github.com/block-vision/sui-go-sdk/sui"
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
