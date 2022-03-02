package worker

import (
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

// TopicAnnouncement used to transaction randomness announcements
const TopicAnnouncement = "worker.ethereum.announce"

type (
	// Announcement contains the data to call the reward function
	// of the contract with
	Announcement struct {
		TransactionHash ethereum.Hash    `json:"transaction_hash"`
		FromAddress     ethereum.Address `json:"from_address"`
		ToAddress       ethereum.Address `json:"to_address"`
		SourceRandom    []uint32         `json:"random_source"`
		SourcePayouts   []*misc.BigInt   `json:"random_payouts"`
	}
)
