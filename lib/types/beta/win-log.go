package beta

// BetaWinLog is a log from the rng service, including if that
// transaction won
type BetaWinLog struct {
	BlockHash        string `json:"block_hash"`
	TransactionIndex uint32 `json:"txn_index"`
	WinAmount        uint64 `json:"win_amount"`
}
