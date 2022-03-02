package beta

import "github.com/fluidity-money/fluidity-app/lib/types/misc"

type BetaWinningTransaction struct {
	TransactionHash   string      `json:"transaction_hash"`
	FromAddress       string      `json:"from_address"`
	ToAddress         string      `json:"to_address"`
	ContractCall      bool        `json:"contract_call"`
	ReceiverWinAmount misc.BigInt `json:"receiver_win_amount"`
	SenderWinAmount   misc.BigInt `json:"sender_win_amount"`
}
