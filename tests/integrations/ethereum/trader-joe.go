// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

// WARNING: this is not a representative test of reality. this is a faux
// test for making sure our catch-all works. as such, the fees are 0

const integrationTestTraderJoe = `[
  {
    "transfer": {
      "transaction": "0x22e978cddf7f2f31c7572fb87d4634287d23424cc365f12eb2520297cfbe56d3",
      "log": {
        "data": "",
        "address": "0x7a08eaa93c05abd6b86bb09b0f565d6fc499ee35",
        "topics": [
          "0xad7d6f97abf51ce18e17a38f4d70e975be9c0708474987bb3e26ad21bd93ca70"
        ],
        "log_index": "3"
      },
      "application": 22
    },
    "transaction": {
      "to": "0xb6a2a7456e651cc7ceb99735a086bff540e94d5d",
      "from": "0x7a08eaa93c05abd6b86bb09b0f565d6fc499ee35",
      "hash": "0x22e978cddf7f2f31c7572fb87d4634287d23424cc365f12eb2520297cfbe56d3"
    },
    "expected_sender": "0x7a08eaa93c05abd6b86bb09b0f565d6fc499ee35",
    "expected_recipient": "0x7a08eaa93c05abd6b86bb09b0f565d6fc499ee35",
    "expected_fees": "",
    "expected_volume": "",
    "expected_emission": {
      "trader_joe": 0
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 6,
    "contract_address": "0xb6a2a7456e651cc7ceb99735a086bff540e94d5d"
  }
]
`
