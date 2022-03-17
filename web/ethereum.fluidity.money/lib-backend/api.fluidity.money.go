package api_fluidity_money

// api_fluidity_money provides request handlers that utilise the database to
// get the size of the prize pool, the historical data of the past winnings
// and the prize board.

import "github.com/fluidity-money/fluidity-app/lib/types/network"

// NetworkEthereum to use when looking up data from the database and
// filtering queue messages
const NetworkEthereum = network.NetworkEthereum
