package addresslinker

import (
	"fmt"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

const addressConfirmerAbiString = `[
{
  "anonymous": false,
  "inputs": [
    { "indexed": true, "internalType": "address", "name": "addr", "type": "address" },
    { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }
  ],
  "name": "AddressConfirmed",
  "type": "event"
}
]`

var AddressConfirmerAbi ethAbi.ABI

func DecodeAddressConfirmation(log ethTypes.Log) (address, owner ethTypes.Address, err error) {
	if len(log.Topics) != 3 {
		// wrong event
		err = fmt.Errorf(
			"Wrong number of topics! Expected %d, got %d!",
			3,
			len(log.Topics),
		)

		return
	}

	var (
		topic_    = log.Topics[0]
		address__ = log.Topics[1].String()
		owner__   = log.Topics[2].String()

		topic = ethereum.ConvertInternalHash(topic_)
	)

	if topic != AddressConfirmerAbi.Events["AddressConfirmed"].ID {
		// no match
		err = fmt.Errorf(
			"Topic didn't match! Expected %v, got %v",
			topic,
			AddressConfirmerAbi.Events["AddressConfirmed"].ID,
		)

		return
	}

	address_ := common.HexToAddress(address__)
	owner_ := common.HexToAddress(owner__)

	address = ethereum.ConvertGethAddress(address_)
	owner = ethereum.ConvertGethAddress(owner_)

	return address, owner, nil
}
