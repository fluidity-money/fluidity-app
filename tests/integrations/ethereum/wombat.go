// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestWombat = `
[
  {
    "transfer": {
      "transaction": "0xdb82eaaf3203668a0d88cc45965b2f727cd01677aef7b5917cc328dcc3e08b03",
      "log": {
        "data": "AAAAAAAAAAAAAAAA/5cKYaBLHKFINKQ/XeRTPr3bXMgAAAAAAAAAAAAAAAD9CGvHzVxIHcychevkeKHAtp/LuQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF9eEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAX2SOI=",
        "address": "0xc6bc781e20f9323012f6e422bdf552ff06ba6cd1",
        "topics": [
          "0x54787c404bb33c88e86f4baf88183a3b0141d0a848e6a9f7a13b66ae3a9b73d1",
          "0000000000000000000000000c4b2f992496376c6127e73f1211450322e580668",
          "0x000000000000000000000009bb098cb9987918120acb6c30e086d84ab2516dd"
        ]
      },
      "application": 20
    },
    "transaction": {
      "to": "0xc4b2f992496376c6127e73f1211450322e580668",
	  "from": "0x9bb098cb9987918120acb6c30e086d84ab2516dd",
	  "hash": "0xdb82eaaf3203668a0d88cc45965b2f727cd01677aef7b5917cc328dcc3e08b03"
    },
    "rpc_methods": {
    },
    "call_methods": {
	  "haircutRate()": {
        "": "0x00000000000000000000000000000000000000000000000000005af3107a4000"
      }
    },
    "expected_sender": "0x9bb098cb9987918120acb6c30e086d84ab2516dd",
    "expected_recipient": "0xc6bc781e20f9323012f6e422bdf552ff06ba6cd1",
    "expected_fees": "1/100",
    "expected_volume": "100",
    "token_decimals": 6,
    "contract_address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    "expected_emission": {
	  "wombat": 0.01
    }
  },
  {
    "transfer": {
      "transaction": "0x4679608df75fec2b6c9dd24d02ab20c01331d137f6d62f63154a13be77472dd9",
      "log": {
        "data": "AAAAAAAAAAAAAAAA2hAAnL1dB90M7MZhYfyT18kADaEAAAAAAAAAAAAAAACviNBl53yMwiOTJ8Xts6QyJo5YMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABV3mp3m7rAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXmCYg=",
        "address": "0xc6bc781e20f9323012f6e422bdf552ff06ba6cd1",
        "topics": [
          "0x54787c404bb33c88e86f4baf88183a3b0141d0a848e6a9f7a13b66ae3a9b73d1",
          "0000000000000000000000000c4b2f992496376c6127e73f1211450322e580668",
          "0x000000000000000000000009bb098cb9987918120acb6c30e086d84ab2516dd"
        ]
      },
      "application": 20
    },
    "transaction": {
      "to": "0xc4b2f992496376c6127e73f1211450322e580668",
	  "from": "0x9bb098cb9987918120acb6c30e086d84ab2516dd",
	  "hash": "0x4679608df75fec2b6c9dd24d02ab20c01331d137f6d62f63154a13be77472dd9"
    },
    "rpc_methods": {
    },
    "call_methods": {
	  "haircutRate()": {
        "": "0x00000000000000000000000000000000000000000000000000005af3107a4000"
      }
    },
    "expected_sender": "0x9bb098cb9987918120acb6c30e086d84ab2516dd",
    "expected_recipient": "0xc6bc781e20f9323012f6e422bdf552ff06ba6cd1",
    "expected_fees": "494809/49995000",
    "expected_volume": "989618/9999",
    "token_decimals": 6,
    "contract_address": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    "expected_emission": {
	  "wombat": 0.009897169716971696
    }
  }
]
`
