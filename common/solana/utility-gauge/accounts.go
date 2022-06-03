package utility_gauge

type (
	Gaugemeister struct {
		Base                 ag_solanago.PublicKey
		Bump                 uint8
		Rewarder             ag_solanago.PublicKey
		Operator             ag_solanago.PublicKey
		Locker               ag_solanago.PublicKey
		Foreman              ag_solanago.PublicKey
		EpochDurationSeconds uint32
		CurrentRewardsEpoch  uint32
		NextEpochStartsAt    uint64
		LockerTokenMint      ag_solanago.PublicKey
		LockerGovernor       ag_solanago.PublicKey
	}

	Gauge struct {
		Gaugemeister ag_solanago.PublicKey
		UtilityMine  ag_solanago.PublicKey
		IsDisabled   bool
	}

	EpochGauge struct {
		Gauge       ag_solanago.PublicKey
		VotingEpoch uint32
		TotalPower  uint64
	}
)
