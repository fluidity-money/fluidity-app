package main

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	ethRlp "github.com/ethereum/go-ethereum/rlp"
)

func decodeAnnouncementRlp(announcementRlp misc.Blob) (*worker.EthereumAnnouncement, error) {

	announcementRlpBytes := []byte(announcementRlp)

	var announcement worker.EthereumAnnouncement

	err := ethRlp.DecodeBytes(announcementRlpBytes, &announcement)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to decode the RLP bytes containing announcement! %v",
			err,
		)
	}

	return &announcement, nil
}
