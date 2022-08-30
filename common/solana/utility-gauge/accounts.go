package utility_gauge

import (
	"github.com/fluidity-money/fluidity-app/common/solana"
)

type (
	// Gaugemeister is the SSOT account for voting parameters
	Gaugemeister struct {
		Base     solana.PublicKey
		Bump     uint8
		Rewarder solana.PublicKey
		Operator solana.PublicKey
		Locker   solana.PublicKey
		Foreman  solana.PublicKey

		// EpochDurationSeconds is the voting period
		EpochDurationSeconds uint32
		// CurrentRewardsEpoch is the last locked gauge powers
		CurrentRewardsEpoch uint32
		// NextEpochStartsAt is a unix timestamp
		NextEpochStartsAt uint64
		// LockerTokenMint is the veToken mint
		LockerTokenMint solana.PublicKey
		// LockerGovernor is the Governor of Locker
		LockerGovernor solana.PublicKey
	}

	// Gauge is the derived account linking protocol to Gaugemeister
	Gauge struct {
		Gaugemeister solana.PublicKey
		UtilityMine  solana.PublicKey
		IsDisabled   bool
	}

	// EpochGauge is the account accumulating votes for an epoch
	EpochGauge struct {
		Gauge       solana.PublicKey
		VotingEpoch uint32
		TotalPower  uint64
	}
)
