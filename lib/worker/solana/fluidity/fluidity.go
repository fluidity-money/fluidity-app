package fluidity

// PayoutInstruction that should be serialised using Borsh to call the
// contract to payout a winner
type PayoutInstruction struct {
	Variant   uint8
	Amount    uint64
	TokenName string
	BumpSeed  uint8
}
