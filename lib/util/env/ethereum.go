package env

import (
	"crypto/ecdsa"

	"github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

func EthereumPrivateKeyOrFatal(env string) *ecdsa.PrivateKey {
	prikeyString := GetEnvOrFatal(env)

	key, err := ethCrypto.HexToECDSA(prikeyString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to parse an ethereum private key from env!"
			k.Payload = err
		})
	}

	return key
}

func InternalAddressOrFatal(name string) ethereum.Address {
	addressString := GetEnvOrFatal(name)

	return ethereum.AddressFromString(addressString)
}

func EthereumAddressOrFatal(name string) common.Address {
	addressString := GetEnvOrFatal(name)

	return common.HexToAddress(addressString)
}
