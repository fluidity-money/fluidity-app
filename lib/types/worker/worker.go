package worker

import (
	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
)

type (
	// Emission contains information on the modelling information that led
	// up to the rewarding of the user
	Emission struct {
		Network          string                     `json:"network"`
		TokenDetails     token_details.TokenDetails `json:"token_details"`
		TransactionHash  string                     `json:"transaction_hash"`
		RecipientAddress string                     `json:"recipient_address"`
		SenderAddress    string                     `json:"sender_address"`

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
		} `json:"winning_chances"`
	}

	// EthereumAnnouncement contains the data to call the reward function of
	// the contract with
	EthereumAnnouncement struct {
		TransactionHash ethereum.Hash              `json:"transaction_hash"`
		BlockNumber     *misc.BigInt               `json:"block_number"`
		FromAddress     ethereum.Address           `json:"from_address"`
		ToAddress       ethereum.Address           `json:"to_address"`
		SourceRandom    []uint32                   `json:"random_source"`
		SourcePayouts   []*misc.BigInt             `json:"random_payouts"`
		TokenDetails    token_details.TokenDetails `json:"token_details"`
		Emissions       Emission                   `json:"emissions"`
	}

	EthereumWinnerAnnouncement struct {
		TransactionHash ethereum.Hash              `json:"transaction_hash"`
		BlockNumber     *misc.BigInt               `json:"block_number"`
		FromAddress     ethereum.Address           `json:"from_address"`
		ToAddress       ethereum.Address           `json:"to_address"`
		FromWinAmount   *misc.BigInt               `json:"from_win_amount"`
		ToWinAmount     *misc.BigInt               `json:"to_win_amount"`
		TokenDetails    token_details.TokenDetails `json:"token_details"`
	}

	EthereumReward struct {
		Winner          ethereum.Address           `json:"winner"`
		WinAmount       *misc.BigInt               `json:"amount"`
		TransactionHash ethereum.Hash              `json:"transaction_hash"`
		BlockNumber     *misc.BigInt               `json:"block_number"`
		TokenDetails    token_details.TokenDetails `json:"token_details"`
	}

	EthereumSpooledRewards struct {
		Token      token_details.TokenDetails `json:"token_details"`
		Winner     ethereum.Address           `json:"winner"`
		WinAmount  *misc.BigInt               `json:"amount"`
		FirstBlock *misc.BigInt               `json:"first_block"`
		LastBlock  *misc.BigInt               `json:"last_block"`
	}

	EthereumBlockLog struct {
		BlockHash    ethereum.Hash          `json:"block_hash"`
		BlockBaseFee misc.BigInt            `json:"block_base_fee"`
		BlockTime    uint64                 `json:"block_time"`
		Logs         []ethereum.Log         `json:"logs"`
		Transactions []ethereum.Transaction `json:"transactions"`
		BlockNumber  misc.BigInt            `json:"block_number"`
	}

	EthereumWorkerDecorator struct {
		SenderUtilityMiningAmount    misc.BigInt `json:"sender_amount"`
		RecipientUtilityMiningAmount misc.BigInt `json:"receiver_amount"`
	}

	EthereumDecoratedTransfer struct {
		SenderAddress          ethereum.Address        `json:"sender_address"`
		RecipientAddress       ethereum.Address        `json:"recipient_address"`
		SenderWinningAmount    *misc.BigInt            `json:"sender_win_amount"`
		RecipientWinningAmount *misc.BigInt            `json:"recipient_win_amount"`
		Decorator              EthereumWorkerDecorator `json:"decorator"`
	}

	EthereumHintedBlock struct {
		BlockHash          ethereum.Hash               `json:"block_hash"`
		BlockBaseFee       misc.BigInt                 `json:"block_base_fee"`
		BlockTime          uint64                      `json:"block_time"`
		BlockNumber        misc.BigInt                 `json:"block_number"`
		TransferCount      int                         `json:"transfer_count"`
		DecoratedTransfers []EthereumDecoratedTransfer `json:"decorated_transfers"`
	}

	EthereumServerWork struct {
		EthereumBlockLog    *EthereumBlockLog    `json:"block_log"`
		EthereumHintedBlock *EthereumHintedBlock `json:"hinted_block"`
	}

	EthereumClientAnnouncement struct {
		EthereumHintedBlock   *EthereumHintedBlock   `json:"hinted_block"`
		EthereumAnnouncements []EthereumAnnouncement `json:"announcement"`
	}

	EthereumApplicationEvent struct {
		ApplicationTransfers []libEthereum.Transfer `json:"application_transfers"`
		BlockLog             EthereumBlockLog       `json:"block_log"`
	}

	// SolanaWinnerAnnouncement to use to report a winner and its randomness
	SolanaWinnerAnnouncement struct {
		WinningTransactionHash string   `json:"transaction_winning"`
		SenderAddress          string   `json:"sender_address"`
		RecipientAddress       string   `json:"receiver_address"`
		WinningAmount          uint64   `json:"winning_amount"`
		TokenName              string   `json:"token_name"`
		FluidMintPubkey        string   `json:"fluid_mint_pubkey"`
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
