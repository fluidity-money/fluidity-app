package rpc

import (
	"encoding/json"
	"fmt"
)

func (s Provider) GetLatestSlot() (uint64, error) {
	res, err := s.RawInvoke("getSlot", []map[string]string{
		{
			"commitment": "finalized",
		},
	})

	if err != nil {
		return 0, fmt.Errorf(
			"failed to getSlot: %v",
			err,
		)
	}

	var latestSlot uint64

	if err := json.Unmarshal(res, &latestSlot); err != nil {
		return 0, fmt.Errorf(
			"failed to decode getSlot, message %#v: %v",
			string(res),
			err,
		)
	}

	return latestSlot, nil
}
