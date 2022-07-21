// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package api_fluidity_money

// api_fluidity_money provides request handlers that utilise the database to
// get the size of the prize pool, the historical data of the past winnings
// and the prize board.

import "github.com/fluidity-money/fluidity-app/lib/types/network"

// NetworkSolana to use when looking up data from the database and
// filtering queue messages
const NetworkSolana = network.NetworkSolana
