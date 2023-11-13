package amm

import (
	"crypto/rand"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum/amm"
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

	// SnowflakeLength for making the update snowflake
	SnowflakeLength = 32

	// TableAmmPositions to store amm positions in
	TableAmmPositions = `amm_positions`

	// TablePendingLpRewards to track unpaid LP rewards
	TablePendingLpRewards = `pending_lp_rewards`
)

// inserts an amm position into the database, defaulting to zero liquidity
func InsertAmmPosition(mint amm.AmmEventPositionMint) {
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
			pool_address,
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

func UpdateAmmPosition(update amm.AmmEventPositionUpdate) {
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

func InsertAmmWinnings(win worker.EthereumWinnerAnnouncement, tokenDetails map[applications.UtilityName]token_details.TokenDetails) {
	var (
		ammPrices = win.Decorator.ApplicationData.AmmPrices

		firstToken  = ammPrices.FirstToken
		firstTick   = ammPrices.FirstTick
		secondToken = ammPrices.SecondToken
		secondTick  = ammPrices.SecondTick
		wins        = win.ToWinAmount
	)

	snowflake := make([]byte, SnowflakeLength)
	rand.Read(snowflake)

	if secondToken == ethereum.AddressFromString("") {
		// swap1
		addAmmWins(win, wins, tokenDetails, firstToken, firstTick, snowflake, false)
		clearSnowflake(snowflake)
		return
	}

	// swap2
	addAmmWins(win, wins, tokenDetails, firstToken, firstTick, snowflake, true)
	addAmmWins(win, wins, tokenDetails, secondToken, secondTick, snowflake, true)
	clearSnowflake(snowflake)
}

// adds amm winnings to the spooler table, split across the different LPs
// if halve is set, halves the winning amount (since swap2s have two winners)
func addAmmWins(win worker.EthereumWinnerAnnouncement, wins map[applications.UtilityName]worker.Payout, tokenDetails map[applications.UtilityName]token_details.TokenDetails, pool ethereum.Address, tick int32, snowflake []byte, halve bool) {
	timescaleClient := timescale.Client()

	two := big.NewInt(2)

	// selects every active LP (positions that are within the range and for the correct token)
	// and then adds an entry with their proportion of the winnings
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
			processing_snowflake,
			reward_sent
		)
		SELECT
			$3,
			$4,
			$5,
			position_id,
			$6 * liquidity / (SELECT sum(liquidity) FROM active_positions),
			$7,
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
			snowflake,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to insert pending LP winnings!"
				k.Payload = err
			})
		}
	}
}

func clearSnowflame(snowflake []byte) {
	timescaleClient := timescale.Client()

	var statementText string

	statementText = fmt.Sprintf(
		`UPDATE %s
            SET processing_snowflake = ''
            WHERE processing_snowflake = $1
		;`,
		TablePendingLpRewards,
	)

	_, err := timescaleClient.Exec(
		statementText,
		snowflake,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to clear a LP reward's snowflake!"
			k.Payload = err
		})
	}

}

// return value for GetAndRemoveRewardsForLp
type AmmRewards struct {
	Utility applications.UtilityName
	Amount  misc.BigInt
}

// GetAndRemoveRewardsForLp to fetch LP rewards, updating them as sent in the database so they don't doublesend
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
			AND processing_snowflake = ''
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
