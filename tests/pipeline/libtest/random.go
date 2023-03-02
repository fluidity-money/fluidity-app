package libtest

import (
	"math/rand"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	typesEth "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

func RandomGethAddress() ethCommon.Address {
    address := ethCommon.Address{}

    rand.Read(address[:])

    return address
}

func RandomHash() typesEth.Hash {
    hash := ethCommon.Hash{}

    rand.Read(hash[:])

    return ethereum.ConvertGethHash(hash)
}

func RandomAddress() typesEth.Address {
    address := RandomGethAddress()

    return ethereum.ConvertGethAddress(address)
}
