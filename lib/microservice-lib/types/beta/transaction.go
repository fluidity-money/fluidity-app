package beta

type BetaTransaction struct {
	TransactionHash string `json:"transaction_hash"`
	BlockHash       string `json:"block_hash"`
	FromAddress     string `json:"from_address"`
	ToAddress       string `json:"to_address"`
	ContractCall    bool   `json:"contract_call"`
	WasWinning      bool   `json:"was_winning"`
}
