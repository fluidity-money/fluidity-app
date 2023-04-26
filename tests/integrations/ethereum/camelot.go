// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestCamelot = `
[
  {
    "transfer": {
      "transaction": "0x8482fef73ee32f85065301775ac244620a7c25fc3ab92e233f54bfc4488890fe",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsaK8LsUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcfoqQ=",
        "address": "0x84652bb2539513baf36e225c930fdd8eaa63ce27",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x00000000000000000000000c873fecbd354f5a56e00e710b90ef4201db2448d",
          "0x000000000000000000000001c31fb3359357f6436565ccb3e982bc6bf4189ae"
        ]
      },
      "application": 15
    },
    "transaction": {
      "to": "0xc873fecbd354f5a56e00e710b90ef4201db2448d",
	  "from": "0x262cb76acee4843e9c7fce4d788172deaaa2d23e",
	  "hash": "0x8482fef73ee32f85065301775ac244620a7c25fc3ab92e233f54bfc4488890fe"
    },
    "rpc_methods": {
    },
    "call_methods": {
      "token0()": {
        "": "0x00000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1"
      },
      "token0FeePercent()": {
        "": "0x000000000000000000000000000000000000000000000000000000000000012c"
      },
	  "token1()": {
        "": "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
      "token1FeePercent()": {
        "": "0x000000000000000000000000000000000000000000000000000000000000012c"
      },
      "FEE_DENOMINATOR()": {
        "": "0x00000000000000000000000000000000000000000000000000000000000186a0"
      }
    },
    "expected_sender": "0x262cb76acee4843e9c7fce4d788172deaaa2d23e",
    "expected_recipient": "0x84652bb2539513baf36e225c930fdd8eaa63ce27",
    "expected_fees": "58192383/49850000",
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "expected_emission": {
	  "camelot": 1.1673497091273821
    }
  },
  {
    "transfer": {
      "transaction": "0x8482fef73ee32f85065301775ac244620a7c25fc3ab92e233f54bfc4488890fe",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFx+ipAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALGivC7FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        "address": "0x84652bb2539513baf36e225c930fdd8eaa63ce27",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x00000000000000000000000c873fecbd354f5a56e00e710b90ef4201db2448d",
          "0x000000000000000000000001c31fb3359357f6436565ccb3e982bc6bf4189ae"
        ]
      },
      "application": 15
    },
    "transaction": {
      "to": "0xc873fecbd354f5a56e00e710b90ef4201db2448d",
	  "from": "0x262cb76acee4843e9c7fce4d788172deaaa2d23e",
	  "hash": "0x8482fef73ee32f85065301775ac244620a7c25fc3ab92e233f54bfc4488890fe"
    },
    "rpc_methods": {
    },
    "call_methods": {
      "token0()": {
        "": "0x00000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1"
      },
      "token0FeePercent()": {
        "": "0x000000000000000000000000000000000000000000000000000000000000012c"
      },
	  "token1()": {
        "": "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
      "token1FeePercent()": {
        "": "0x000000000000000000000000000000000000000000000000000000000000012c"
      },
      "FEE_DENOMINATOR()": {
        "": "0x00000000000000000000000000000000000000000000000000000000000186a0"
      }
    },
    "expected_sender": "0x262cb76acee4843e9c7fce4d788172deaaa2d23e",
    "expected_recipient": "0x84652bb2539513baf36e225c930fdd8eaa63ce27",
    "expected_fees": "58192383/50000000",
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "expected_emission": {
	  "camelot": 1.16384766
    }
  },
  {
    "transfer": {
      "transaction": "0x8482fef73ee32f85065301775ac244620a7c25fc3ab92e233f54bfc4488890fe",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcfoqQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsaK8LsUAAA=",
        "address": "0x84652bb2539513baf36e225c930fdd8eaa63ce27",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x00000000000000000000000c873fecbd354f5a56e00e710b90ef4201db2448d",
          "0x000000000000000000000001c31fb3359357f6436565ccb3e982bc6bf4189ae"
        ]
      },
      "application": 15
    },
    "transaction": {
      "to": "0xc873fecbd354f5a56e00e710b90ef4201db2448d",
	  "from": "0x262cb76acee4843e9c7fce4d788172deaaa2d23e",
	  "hash": "0x8482fef73ee32f85065301775ac244620a7c25fc3ab92e233f54bfc4488890fe"
    },
    "rpc_methods": {
    },
    "call_methods": {
      "token0()": {
        "": "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
      "token0FeePercent()": {
        "": "0x000000000000000000000000000000000000000000000000000000000000012c"
      },
	  "token1()": {
        "": "0x00000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1"
      },
      "token1FeePercent()": {
        "": "0x000000000000000000000000000000000000000000000000000000000000012c"
      },
      "FEE_DENOMINATOR()": {
        "": "0x00000000000000000000000000000000000000000000000000000000000186a0"
      }
    },
    "expected_sender": "0x262cb76acee4843e9c7fce4d788172deaaa2d23e",
    "expected_recipient": "0x84652bb2539513baf36e225c930fdd8eaa63ce27",
    "expected_fees": "58192383/50000000",
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "expected_emission": {
	  "camelot": 1.16384766
    }
  },
  {
    "transfer": {
      "transaction": "0x8482fef73ee32f85065301775ac244620a7c25fc3ab92e233f54bfc4488890fe",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACxorwuxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXH6KkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        "address": "0x84652bb2539513baf36e225c930fdd8eaa63ce27",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x00000000000000000000000c873fecbd354f5a56e00e710b90ef4201db2448d",
          "0x000000000000000000000001c31fb3359357f6436565ccb3e982bc6bf4189ae"
        ]
      },
      "application": 15
    },
    "transaction": {
      "to": "0xc873fecbd354f5a56e00e710b90ef4201db2448d",
	  "from": "0x262cb76acee4843e9c7fce4d788172deaaa2d23e",
	  "hash": "0x8482fef73ee32f85065301775ac244620a7c25fc3ab92e233f54bfc4488890fe"
    },
    "rpc_methods": {
    },
    "call_methods": {
      "token0()": {
        "": "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
      "token0FeePercent()": {
        "": "0x000000000000000000000000000000000000000000000000000000000000012c"
      },
	  "token1()": {
        "": "0x00000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1"
      },
      "token1FeePercent()": {
        "": "0x000000000000000000000000000000000000000000000000000000000000012c"
      },
      "FEE_DENOMINATOR()": {
        "": "0x00000000000000000000000000000000000000000000000000000000000186a0"
      }
    },
    "expected_sender": "0x262cb76acee4843e9c7fce4d788172deaaa2d23e",
    "expected_recipient": "0x84652bb2539513baf36e225c930fdd8eaa63ce27",
    "expected_fees": "58192383/49850000",
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "expected_emission": {
	  "camelot": 1.1673497091273821
    }
  }
]
`
