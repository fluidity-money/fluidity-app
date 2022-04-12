package microservice_ethereum_block_fluid_transfers_amqp

import (
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func bigIntFromPossiblyHex(s string) (*misc.BigInt, error) {
	if strings.HasPrefix(s, "0x") || strings.HasPrefix(s, "0X") {
		return misc.BigIntFromHex(s)
	} else {
		return misc.BigIntFromString(s)
	}
}
