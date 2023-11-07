package amm

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum/amm"
	commonApps "github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	// Context to use for logging
	Context = `TIMESCALE/AMM`

	// TableAmmPositions to store amm positions in
	TableAmmPositions = `amm_positions`

	// TablePendingLpRewards to track unpaid LP rewards
	TablePendingLpRewards = `pending_lp_rewards`
)

func InsertAmmPosition(mint amm.PositionMint) {
	timescaleClient := timescale.Client()

	var (
		id    = mint.Id
		lower = mint.Lower
		upper = mint.Upper
		pool  = mint.Pool

		statementText string
	)

	statementText = fmt.Sprintf(
		`INSERT INTO %s (
            position_id,
            tick_lower,
            tick_upper,
			pool,
            liquidity
		) VALUES (
			$1,
			$2,
			$3,
            $4,
			$5
		);`,
		TableAmmPositions,
	)

	_, err := timescaleClient.Exec(
		statementText,
		id,
		lower,
		upper,
		pool,
		misc.BigIntFromInt64(0),
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert a new position!"
			k.Payload = err
		})
	}
}

func UpdateAmmPosition(update amm.PositionUpdate) {
	timescaleClient := timescale.Client()

	var (
		id    = update.Id
		delta = update.Delta

		statementText string
	)

	statementText = fmt.Sprintf(
		`UPDATE %s
            SET liquidity = liquidity + $1
            WHERE position_id = $2
		;`,
		TableAmmPositions,
	)

	_, err := timescaleClient.Exec(
		statementText,
		delta,
		id,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to update a position's liquidity!"
			k.Payload = err
		})
	}
}

func HandleAmmWinnings(win worker.EthereumWinnerAnnouncement, tokenDetails map[applications.UtilityName]token_details.TokenDetails) {
	if win.Application != commonApps.ApplicationSeawaterAmm || win.Decorator == nil {
		return
	}

	var (
		ammPrices = win.Decorator.ApplicationData.AmmPrices

		firstToken  = ammPrices.FirstToken
		firstTick   = ammPrices.FirstTick
		secondToken = ammPrices.SecondToken
		secondTick  = ammPrices.SecondTick
		wins        = win.ToWinAmount
	)

	if firstToken == ethereum.AddressFromString("") {
		return
	}

	if secondToken == ethereum.AddressFromString("") {
		// swap1
		addAmmWins(win, wins, tokenDetails, firstToken, firstTick, false)
		return
	}

	// swap2
	addAmmWins(win, wins, tokenDetails, firstToken, firstTick, true)
	addAmmWins(win, wins, tokenDetails, secondToken, secondTick, true)
}

func addAmmWins(win worker.EthereumWinnerAnnouncement, wins map[applications.UtilityName]worker.Payout, tokenDetails map[applications.UtilityName]token_details.TokenDetails, pool ethereum.Address, tick int32, halve bool) {
	timescaleClient := timescale.Client()

	two := big.NewInt(2)

	statementText := fmt.Sprintf(
		`WITH active_positions AS (
			SELECT
				position_id,
				liquidity
			FROM %s
			WHERE $1 >= tick_lower
			AND $1 <= tick_upper
			AND pool = $2
		)

		INSERT INTO %s (
			fluid_token_short_name,
			network,
			utility_name,
			position_id,
			amount,
			reward_sent
		)
		SELECT
			$3,
			$4,
			$5,
			position_id,
			$6 * liquidity / (SELECT sum(liquidity) FROM active_positions),
			false
		FROM active_positions
		;`,

		TableAmmPositions,
		TablePendingLpRewards,
	)

	for utility, payout := range wins {
		payoutAmount := new(big.Int).Set(&payout.Native.Int)
		if halve {
			payoutAmount.Div(payoutAmount, two)
		}

		_, err := timescaleClient.Exec(
			statementText,
			tick,
			pool,
			win.TokenDetails.TokenShortName,
			win.Network,
			utility,
			misc.NewBigIntFromInt(*payoutAmount),
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to insert pending LP winnings!"
				k.Payload = err
			})
		}
	}
}

type AmmRewards struct {
	Utility applications.UtilityName
	Amount  misc.BigInt
}

func GetAndRemoveRewardsForLp(network network.BlockchainNetwork, fluidToken string, id misc.BigInt) []AmmRewards {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`UPDATE %s
			SET reward_sent = true
		WHERE
			network = $1
			AND fluid_token_short_name = $2
			AND position_id = $3
			AND reward_sent = false
		RETURNING
			amount,
			utility_name
		;`,

		TablePendingLpRewards,
	)

	rows, err := timescaleClient.Query(
		statementText,
		network,
		fluidToken,
		id,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to fetch unpaid LP winnings!"
			k.Payload = err
		})
	}

	defer rows.Close()

	rewards := make([]AmmRewards, 0)

	for rows.Next() {
		var reward AmmRewards
		err := rows.Scan(
			&reward.Amount,
			&reward.Utility,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to scan a row of unpaid LP winnings!"
				k.Payload = err
			})
		}

		rewards = append(rewards, reward)
	}

	return rewards
}
