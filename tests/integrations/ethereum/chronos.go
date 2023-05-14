// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestChronos = `
[
  {
    "transfer": {
      "transaction": "0x9aacf0f2b9cbe82bf70a8d93846f7a4937811943ccc560e4165a7edca9fc49c6",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhnZpmsfIlpQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT63MI=",
        "address": "0x20585bfbc272a9d58ad17582bcda9a5a57271d6a",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x00000000000000000000000e708aa9e887980750c040a6a2cb901c37aa34f3b",
          "0x000000000000000000000005add1cec842699d7d0eaea77632f92cf3f3ff8cf"
        ]
      },
      "application": 17
    },
    "transaction": {
      "to": "0xe708aa9e887980750c040a6a2cb901c37aa34f3b",
	  "from": "0x5add1cec842699d7d0eaea77632f92cf3f3ff8cf",
	  "hash": "0x9aacf0f2b9cbe82bf70a8d93846f7a4937811943ccc560e4165a7edca9fc49c6"
    },
    "rpc_methods": {
    },
    "call_methods": {
      "token0()": {
        "": "0x00000000000000000000000015b2fb8f08e4ac1ce019eadae02ee92aedf06851"
      },
	  "token1()": {
        "": "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
	  "getFee(bool)": {
        "": "0x0000000000000000000000000000000000000000000000000000000000000014"
      },
      "isStable()": {
        "": "0x0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    "expected_sender": "0x5add1cec842699d7d0eaea77632f92cf3f3ff8cf",
    "expected_recipient": "0x20585bfbc272a9d58ad17582bcda9a5a57271d6a",
    "expected_fees": "41774689/249500000",
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "expected_emission": {
	  "chronos": 0.167433623246493
    }
  }
]
`
