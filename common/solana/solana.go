package solana

import "github.com/fluidity-money/fluidity-app/lib/log"

// ContextLogging to use for logging
const ContextLogging = "SOLANA"

const (
	// SysVarClockAddress
	SysVarClockAddress = "SysvarC1ock11111111111111111111111111111111"

	// SystemProgramIdAddress
	SystemProgramIdAddress = "11111111111111111111111111111111"

	// SysVarRentAddress
	SysVarRentAddress = "SysvarRent111111111111111111111111111111111"
)

var (
	SysVarClockPubkey     PublicKey
	SystemProgramIdPubkey PublicKey
	SysVarRentPubkey      PublicKey
)

func init() {
	var err error

	SysVarClockPubkey, err = PublicKeyFromBase58(SysVarClockAddress)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = ContextLogging
			k.Message = "Failed to convert the sys var clock address to pubkey!"
			k.Payload = err
		})
	}

	SystemProgramIdPubkey, err = PublicKeyFromBase58(SystemProgramIdAddress)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = ContextLogging
			k.Message = "Failed to convert the system program id` address to pubkey!"
			k.Payload = err
		})
	}

	SysVarRentPubkey, err = PublicKeyFromBase58(SysVarRentAddress)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = ContextLogging
			k.Message = "Failed to convert the sys var rent address to pubkey!"
			k.Payload = err
		})
	}
}
