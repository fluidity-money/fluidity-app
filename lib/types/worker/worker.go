package worker

import (
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

type (
	// Emissions contains information on the modelling information that led
	// up to the rewarding of the user
	Emissions struct {
		Payout struct {
			P                             string `json:"p"`
			A                             string `json:"a"`
			M                             string `json:"m"`
			G                             string `json:"g"`
			B                             string `json:"b"`
			Delta                         string `json:"delta"`
			ApyPlusDelta                  string `json:"apy+delta"`
			Atx                           string `json:"atx"`
			Apy                           string `json:"apy"`
			BpyForStakedUsdInsideFunction string `json:"bpy_for_staked_usd_inside_payout_function"`
			BlockTime                     string `json:"block_time"`
			RewardPool                    string `json:"reward_pool"`
		} `json:"payout"`

		// calculate n function
		CalculateN struct {
			ProbabilityM string `json:"probability_m"`
			Factorial    string `json:"factorial"`
			Atx          string `json:"atx"`
			N            string `json:"n"`
		} `json:"calculate_n"`

		// WinningChances not included

		NativeIsWinning struct {
			TestingBalls string `json:"testing_balls"`
		} `json:"native_is_winning"`

		CalculateBpy struct {
			BlockTimeInSeconds                          string `json:"block_time_in_seconds"`
			CompSupplyApy                               string `json:"comp_supply_apy"`
			BlockTimeInSecondsMultipliedByCompSupplyApy string `json:"block_time_in_seconds_multiplied_by_comp_supply_apy"`
		} `json:"calculate_bpy"`

		AaveGetTokenApy struct {
			DepositApr       string `json:"deposit_apr"`
			APRPerDay        string `json:"apr_per_day"`
			OnePlusAprPerDay string `json:"one_plus_apr_per_day"`
			CompoundedApr    string `json:"compounded_apr"`
			DepositApy       string `json:"deposit_apy"`
		} `json:"aave_get_token_apy"`

		CompoundGetTokenApy struct {
			BlocksPerDay                      string `json:"blocks_per_day"`
			SupplyRatePerBlockDivEthMantissa  string `json::"supply_rate_per_block_div_eth_mantissa"`
			SupplyRatePerBlockMulBlocksPerDay string `json:"supply_rate_per_block_mul_blocks_per_day"`
			PowLeftSide                       string `json:"pow_left_side"`
			PowLeftSideDaysPerYear            string `json:"pow_left_side_days_per_year"`
			SupplyApy                         string `json:"supply_apy"`
		} `json:"compound_get_token_apy"`
	}

	// EthereumAnnouncement contains the data to call the reward function of
	// the contract with
	EthereumAnnouncement struct {
		TransactionHash ethereum.Hash    `json:"transaction_hash"`
		FromAddress     ethereum.Address `json:"from_address"`
		ToAddress       ethereum.Address `json:"to_address"`
		SourceRandom    []uint32         `json:"random_source"`
		SourcePayouts   []*misc.BigInt   `json:"random_payouts"`
		Emissions       Emissions        `json:"emissions"`
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
		WinningTransactionHash string    `json:"transaction_winning"`
		SenderAddress          string    `json:"sender_address"`
		RecipientAddress       string    `json:"receiver_address"`
		WinningAmount          uint64    `json:"winning_amount"`
		Emissions              Emissions `json:"emissions"`
	}
)
