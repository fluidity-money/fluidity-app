package rpc

import (
	"encoding/json"
	"fmt"
)

type getBlocksResult struct {
	Result []uint64               `json:"result"`
	Error  map[string]interface{} `json:"error"`
}

func (s Provider) GetConfirmedBlocks(from, to uint64) ([]uint64, error) {
	res, err := s.RawInvoke("getBlocksWithLimit", []interface{}{
		from,
		to,
		map[string]string{
			"commitment": "finalized",
		},
	})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to getBlocksWithLimit: %v",
			err,
		)
	}

	var blocks []uint64

	if err := json.Unmarshal(res, &blocks); err != nil {
		return nil, fmt.Errorf(
			"failed to decode getBlocksWithLimit, message %#v: %v",
			string(res),
			err,
		)
	}

	return blocks, nil
}
