package tvl

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/ido"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

const (
	// Context to use when logging
	Context = `TIMESCALE/TVL`

	// TableTvl is the table to store tvl data in
	TableTvl = `tvl`
)

type TvlUpdate = ido.TvlUpdateContainer

func InsertTvl(update TvlUpdate) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			tvl,
			network,
			contract_address
		)

		VALUES (
			$1,
			$2,
			$3
		)`,

		TableTvl,
	)

	_, err := timescaleClient.Exec(
		statementText,
		update.Tvl,
		update.Network,
		update.ContractAddress,
	)

	if err != nil {
	    log.Fatal(func (k *log.Log) {
			k.Context = Context
	        k.Message = "Failed to insert tvl update!"
	        k.Payload = err
	    })
	}
}

func GetDailyAverageTvl(network network.BlockchainNetwork, days int64) *big.Rat {
	timescaleClient := timescale.Client()

	// fetch the daily average for each day we have data for
	statementText := fmt.Sprintf(
		`SELECT
			time_bucket('1 day', time) as day, avg(tvl)
		FROM %s
		WHERE network = $1
		AND time > now() - INTERVAL '1 day' * $2
		GROUP BY day`,

		TableTvl,
	)

	rows, err := timescaleClient.Query(
		statementText,
		network,
		days,
	)

	if err != nil {
	    log.Fatal(func (k *log.Log) {
			k.Context = Context
	        k.Message = "Failed to get daily TVL averages!"
	        k.Payload = err
	    })
	}

	defer rows.Close()

	// we don't get any rows for the days we don't have data for, which is
	// fine, since we treat them as an average of 0
	average := new(big.Rat)

	averageScale := big.NewRat(1, days)

	for rows.Next() {
		var (
			timestamp []byte
			averageBytes []byte
		)

		err := rows.Scan(&timestamp, &averageBytes)

		if err != nil {
		    log.Fatal(func (k *log.Log) {
				k.Context = Context
		        k.Message = "Failed to scan a daily average row!"
		        k.Payload = err
		    })
		}

		averageString := string(averageBytes)

		dailyAverage, success := new(big.Rat).SetString(averageString)

		if success != true {
			log.Debug(func (k *log.Log) {
				k.Context = Context
			    k.Format("Failed to read daily average %d as a rational number!", averageString)
			})
		}

		dailyAverage.Mul(dailyAverage, averageScale)

		average.Add(average, dailyAverage)
	}

	return average
}
