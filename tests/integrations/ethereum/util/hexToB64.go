package test_utils

import (
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func decodeHexToB64(hex string) string {
	bytes, err := hexutil.Decode(hex)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode hex!"
			k.Payload = err
		})
	}

	b := misc.Blob(bytes)
	m, err := b.MarshalJSON()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to marshal blob to JSON!"
			k.Payload = err
		})
	}

	return string(m)
}
