package utility_gauge

import (
	solana "github.com/gagliardetto/solana-go"
)

type (
	Gaugemeister struct {
		Base                 solana.PublicKey
		Bump                 uint8
		Rewarder             solana.PublicKey
		Operator             solana.PublicKey
		Locker               solana.PublicKey
		Foreman              solana.PublicKey
		EpochDurationSeconds uint32
		CurrentRewardsEpoch  uint32
		NextEpochStartsAt    uint64
		LockerTokenMint      solana.PublicKey
		LockerGovernor       solana.PublicKey
	}

	Gauge struct {
		Gaugemeister solana.PublicKey
		UtilityMine  solana.PublicKey
		IsDisabled   bool
	}

	EpochGauge struct {
		Gauge       solana.PublicKey
		VotingEpoch uint32
		TotalPower  uint64
	}
)
