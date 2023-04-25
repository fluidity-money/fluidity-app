// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestCamelot = `
[
  {
    "transfer": {
      "transaction": "0x6a70965768d36ca48a90d5ba6d7c9552721978591d2317aa9ea0db2ba3cc51c6",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI=",
        "address": "0x6a78e84fa0edad4d99eb90edc041cdbf85925961",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x00000000000000000000000c873fecbd354f5a56e00e710b90ef4201db2448d",
          "0x00000000000000000000000a6c5c7d189fa4eb5af8ba34e63dcdd3a635d433f"
        ]
      },
      "application": 15
    },
    "transaction": {
      "to": "0x09e18590e8f76b6cf471b3cd75fe1a1a9d2b2c2b",
	  "from": "0xbe01369aeefcff75b495700ec2494abdc4f6c445",
	  "hash": "0x6a70965768d36ca48a90d5ba6d7c9552721978591d2317aa9ea0db2ba3cc51c6"
    },
    "rpc_methods": {
    },
    "call_methods": {
      "token0()": {
        "": "0x00000000000000000000000009e18590e8f76b6cf471b3cd75fe1a1a9d2b2c2b"
      },
      "token0FeePercent()": {
        "": "0x00000000000000000000000000000000000000000000000000000000000001f4"
      },
	  "token1()": {
        "": "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
      "token1FeePercent()": {
        "": "0x00000000000000000000000000000000000000000000000000000000000001f4"
      },
      "FEE_DENOMINATOR()": {
        "": "0x00000000000000000000000000000000000000000000000000000000000186a0"
      }
    },
    "expected_sender": "",
    "expected_recipient": "",
    "expected_fees": "0.0008",
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "expected_emission": {
	"camelot": 0.0008
    }
  }
]
`
