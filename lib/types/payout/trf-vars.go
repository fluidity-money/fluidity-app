package payout

type TrfVars struct {
	Chain   string
	Network string

	PayoutFreqNum    int64
	PayoutFreqDenom  int64
	DeltaWeightNum   int64
	DeltaWeightDenom int64
	WinningClasses   int
}
