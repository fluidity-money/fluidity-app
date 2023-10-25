package amm

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/ethereum/amm"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
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
