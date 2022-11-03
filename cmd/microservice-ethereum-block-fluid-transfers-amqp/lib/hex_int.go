package microservice_ethereum_block_fluid_transfers_amqp

import (
	"encoding/json"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common/hexutil"
)

// hexInt that contains a big.Int
type hexInt big.Int

func (hex *hexInt) UnmarshalJSON(b []byte) (err error) {
	var str string

	if err = json.Unmarshal(b, &str); err != nil {
		return fmt.Errorf(
			"Failed to unmarshal a JSON blob containing %v! %v",
			b,
			err,
		)
	}

	hex_, err := hexutil.DecodeBig(str)

	if err != nil {
		return fmt.Errorf(
			"failed to decode a hex string of %v to a bigint! %v",
			str,
			err,
		)
	}

	h := hexInt(*hex_)

	hex = &h

	return
}
