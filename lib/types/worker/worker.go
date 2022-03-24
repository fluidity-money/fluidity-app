package worker

import (
	"github.com/fluidity-money//fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

type (
	// Emission contains information on the modelling information that led
	// up to the rewarding of the user
	Emission struct {
		Network      string                     `json:"network"`
		TokenDetails token_details.TokenDetails `json:"token_details"`

		Payout struct {
			P               interface{} `json:"p"`
			A               interface{} `json:"a"`
			M               interface{} `json:"m"`
			G               interface{} `json:"g"`
			B               interface{} `json:"b"`
			Delta           interface{} `json:"delta"`
			ApyPlusDelta    interface{} `json:"apy+delta"`
			Atx             interface{} `json:"atx"`
			Apy             interface{} `json:"apy"`
			BpyForStakedUsd interface{} `json:"bpy_for_staked_usd"`
			BlockTime       interface{} `json:"block_time"`
			RewardPool      interface{} `json:"reward_pool"`
		} `json:"payout"`

		// calculate n function
		CalculateN struct {
			ProbabilityM interface{} `json:"probability_m"`
			Factorial    interface{} `json:"factorial"`
			Atx          interface{} `json:"atx"`
			N            interface{} `json:"n"`
		} `json:"calculate_n"`

		// WinningChances not included

		NativeIsWinning struct {
			TestingBalls interface{} `json:"testing_balls"`
		} `json:"native_is_winning"`

		CalculateBpy struct {
			BlockTimeInSeconds                          interface{} `json:"block_time_in_seconds"`
			CompSupplyApy                               interface{} `json:"comp_supply_apy"`
			BlockTimeInSecondsMultipliedByCompSupplyApy interface{} `json:"block_time_in_seconds_multiplied_by_comp_supply_apy"`
		} `json:"calculate_bpy"`

		AaveGetTokenApy struct {
			DepositApr       interface{} `json:"deposit_apr"`
			APRPerDay        interface{} `json:"apr_per_day"`
			OnePlusAprPerDay interface{} `json:"one_plus_apr_per_day"`
			CompoundedApr    interface{} `json:"compounded_apr"`
			DepositApy       interface{} `json:"deposit_apy"`
		} `json:"aave_get_token_apy"`

		CompoundGetTokenApy struct {
			BlocksPerDay                      interface{} `json:"blocks_per_day"`
			SupplyRatePerBlockDivEthMantissa  interface{} `json::"supply_rate_per_block_div_eth_mantissa"`
			SupplyRatePerBlockMulBlocksPerDay interface{} `json:"supply_rate_per_block_mul_blocks_per_day"`
			PowLeftSide                       interface{} `json:"pow_left_side"`
			PowLeftSideDaysPerYear            interface{} `json:"pow_left_side_days_per_year"`
			SupplyApy                         interface{} `json:"supply_apy"`
		} `json:"compound_get_token_apy"`

		WinningChances struct {
			AtxAtEnd interface{} `json:"atx_at_end"`
		} `json:"winning_chances"`
	}

	// EthereumAnnouncement contains the data to call the reward function of
	// the contract with
	EthereumAnnouncement struct {
		TransactionHash ethereum.Hash    `json:"transaction_hash"`
		FromAddress     ethereum.Address `json:"from_address"`
		ToAddress       ethereum.Address `json:"to_address"`
		SourceRandom    []uint32         `json:"random_source"`
		SourcePayouts   []*misc.BigInt   `json:"random_payouts"`
		Emissions       Emission         `json:"emissions"`
	}

	EthereumBlockLog struct {
		BlockHash    ethereum.Hash          `json:"blockHash"`
		BlockBaseFee misc.BigInt            `json:"blockBaseFee"`
		BlockTime    uint64                 `json:"blockTime"`
		Logs         []ethereum.Log         `json:"logs"`
		Transactions []ethereum.Transaction `json:"transactions"`
		BlockNumber  uint64                 `json:"blockNumber"`
	}

	// SolanaWinnerAnnouncement to use to report a winner and its randomness
	SolanaWinnerAnnouncement struct {
		WinningTransactionHash string   `json:"transaction_winning"`
		SenderAddress          string   `json:"sender_address"`
		RecipientAddress       string   `json:"receiver_address"`
		WinningAmount          uint64   `json:"winning_amount"`
		Emissions              Emission `json:"emissions"`
	}
)

func NewEthereumEmission() *Emission {
	emission := new(Emission)
	emission.Network = "ethereum"
	return emission
}

func NewSolanaEmission() *Emission {
	emission := new(Emission)
	emission.Network = "solana"
	return emission
}
