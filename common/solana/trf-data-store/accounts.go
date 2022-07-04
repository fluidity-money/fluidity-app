package trf_data_store

import solana "github.com/gagliardetto/solana-go"

type (
	// TrfDataStore is the derived account storing active TRF vars
	TrfDataStore struct {
		Authority        solana.PublicKey `json:"authority"`
		Bump             uint8            `json:"bump"`
		PayoutFreqNum    uint32           `json:"payout_freq_num"`
		PayoutFreqDenom  uint32           `json:"payout_freq_denom"`
		WinningClasses   uint8            `json:"winning_classes"`
		DeltaWeightNum   uint32           `json:"delta_weight_num"`
		DeltaWeightDenom uint32           `json:"delta_weigh_denom"`
	}
)
