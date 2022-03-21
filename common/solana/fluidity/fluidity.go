package fluidity

const (
	// VariantPayout to use when making payouts
	VariantPayout = 2

	// VariantSendAmount to use when submitting transfers in the contract
	VariantSendAmount = 3
)

type (
	// InstructionPayout that should be serialised using Borsh to call the
	// contract to payout a winner
	InstructionPayout struct {
		Variant   uint8
		Amount    uint64
		TokenName string
		BumpSeed  uint8
	}

	// InstructionTransfer used when making transfers of the token
	InstructionTransfer struct {
		Variant uint8
		Amount uint64
	}
)
