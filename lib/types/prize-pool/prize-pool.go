package prize_pool

import "time"

type PrizePool struct {
	Network     string    `json:"network"`
	Amount      float64   `json:"amount"`
	LastUpdated time.Time `json:"last_updated"`
}
