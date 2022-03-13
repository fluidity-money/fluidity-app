package api_fluidity_money

import (
	"github.com/fluidity-money/microservice-lib/types/prize-pool"
	"github.com/fluidity-money/microservice-lib/types/user-actions"
	"github.com/fluidity-money/microservice-lib/types/winners"
)

// Update is relayed over websocket when an update event happens
type Update struct {
	Winner     *winners.Winner          `json:"winner"`
	UserAction *user_actions.UserAction `json:"user_action"`
	PrizePool  *prize_pool.PrizePool    `json:"prize_pool"`
}
