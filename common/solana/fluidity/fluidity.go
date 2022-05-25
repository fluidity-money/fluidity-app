package fluidity

const (
	// VariantPayout used when rewarding a user
	VariantPayout = 2

	// VariantDrain used when draining payout acc
	VariantDrain = 6
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

	// InstructionDrain used to send payout funds to a receiver
	InstructionDrain struct {
		Variant   uint8
		Amount    uint64
		TokenName string
		BumpSeed  uint8
	}
)

