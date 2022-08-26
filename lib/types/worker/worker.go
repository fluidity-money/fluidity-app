package worker

import (
	"encoding/json"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/token-details"
)

type (
	// WorkerConfigEthereum to be used with any EVM chains to store config
	// that was previously hardcoded
	WorkerConfigEthereum struct {
		Network                      network.BlockchainNetwork `json:"network"`
		CompoundBlocksPerDay         int                       `json:"compound_blocks_per_day"`
		DefaultSecondsSinceLastBlock uint64                    `json:"default_seconds_since_last_block"`
		CurrentAtxTransactionMargin  int64                     `json:"current_atx_transaction_margin"`
		DefaultTransfersInBlock      int                       `json:"default_transfers_in_block"`
	}

	// WorkerConfigSolana that was previously hardcoded for Solana only
	WorkerConfigSolana struct {
		SolanaBlockTime uint64 `json:"solana_block_time"`
		TransferCompute int    `json:"transfer_compute"`
	}

	// Emission contains information on the modelling information that led
	// up to the rewarding of the user
	Emission struct {
		LastUpdated time.Time `json:"last_updated"`

		Network          string                     `json:"network"`
		TokenDetails     token_details.TokenDetails `json:"token_details"`
		TransactionHash  string                     `json:"transaction_hash"`
		RecipientAddress string                     `json:"recipient_address"`
		SenderAddress    string                     `json:"sender_address"`

		EthereumBlockNumber misc.BigInt `json:"ethereum_block_number"`
		SolanaSlotNumber    misc.BigInt `json:"solana_slot_number"`

		AverageTransfersInBlock float64 `json:"average_transfers_in_block"`

		Payout struct {
			Winnings        float64 `json:"winnings"` // Winnings
			P               float64 `json:"p"`        // Probability
			A               float64 `json:"a"`
			M               int64   `json:"m"` // Winning classes / divisions
			G               float64 `json:"g"` // Gas fee
			B               int64   `json:"b"` // Balls in a single ticket
			Delta           float64 `json:"delta"`
			ApyPlusDelta    float64 `json:"apy+delta"`
			Atx             float64 `json:"atx"`                // Annual number fluid transactions
			Apy             float64 `json:"apy"`                // Annual percentage yield
			BpyForStakedUsd float64 `json:"bpy_for_staked_usd"` // Yield for USD
			BlockTime       uint64  `json:"block_time"`         // Block time
			RewardPool      float64 `json:"reward_pool"`
		} `json:"payout"`

		Fees struct {
			Saber float64 `json:"saber"`
		} `json:"fees"`

		// calculate n function
		CalculateN struct {
			ProbabilityM float64 `json:"probability_m"`
			Factorial    float64 `json:"factorial"`
			Atx          float64 `json:"atx"`
			N            int64   `json:"n"`
		} `json:"calculate_n"`

		// WinningChances not included

		NaiveIsWinning struct {
			TestingBalls []uint32 `json:"testing_balls"`
			IsWinning    bool     `json:"is_winning"`
			MatchedBalls int      `json:"matched_balls"`
		} `json:"naive_is_winning"`

		CalculateBpy struct {
			BlockTimeInSeconds                          uint64  `json:"block_time_in_seconds"`
			CompSupplyApy                               float64 `json:"comp_supply_apy"`
			BlockTimeInSecondsMultipliedByCompSupplyApy float64 `json:"block_time_in_seconds_multiplied_by_comp_supply_apy"`
		} `json:"calculate_bpy"`

		AaveGetTokenApy struct {
			DepositApr       float64 `json:"deposit_apr"`
			APRPerDay        float64 `json:"apr_per_day"`
			OnePlusAprPerDay float64 `json:"one_plus_apr_per_day"`
			CompoundedApr    float64 `json:"compounded_apr"`
			DepositApy       float64 `json:"deposit_apy"`
		} `json:"aave_get_token_apy"`

		CompoundGetTokenApy struct {
			BlocksPerDay                      uint64  `json:"blocks_per_day"`
			SupplyRatePerBlockDivEthMantissa  float64 `json:"supply_rate_per_block_div_eth_mantissa"`
			SupplyRatePerBlockMulBlocksPerDay float64 `json:"supply_rate_per_block_mul_blocks_per_day"`
			PowLeftSide                       float64 `json:"pow_left_side"`
			PowLeftSideDaysPerYear            float64 `json:"pow_left_side_days_per_year"`
			SupplyApy                         float64 `json:"supply_apy"`
		} `json:"compound_get_token_apy"`

		WinningChances struct {
			AtxAtEnd float64 `json:"atx_at_end"`

			Payout1 float64 `json:"payout_1"`
			Payout2 float64 `json:"payout_2"`
			Payout3 float64 `json:"payout_3"`
			Payout4 float64 `json:"payout_4"`
			Payout5 float64 `json:"payout_5"`

			Probability1 float64 `json:"probability_1"`
			Probability2 float64 `json:"probability_2"`
			Probability3 float64 `json:"probability_3"`
			Probability4 float64 `json:"probability_4"`
			Probability5 float64 `json:"probability_5"`
		} `json:"winning_chances"`
	}
)

// Update LastUpdated using the current time
func (emission *Emission) Update() {
	emission.LastUpdated = time.Now()
}

// String the emission to make it suitable for printing
func (emission Emission) String() string {
	bytes, _ := json.Marshal(emission)
	return string(bytes)
}
