// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestSushiswap = `
[
  {
    "transfer": {
      "transaction": "0x486055020bcfdb088de9363349f6e5442007ba6134d092e25f5ba6ad2e4fedf8",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGGVevbvwaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmJaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        "address": "0x397ff1542f962076d0bfe58ea045ffa2d347aca0",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x000000000000000000000000d9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
          "0x000000000000000000000000d4cf8e47beac55b42ae58991785fa326d9384bd1"
        ]
      },
     "application": 18
    },
    "transaction": {
      "to": "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
      "from": "0xd4cf8e47beac55b42ae58991785fa326d9384bd1",
      "hash": "0x486055020bcfdb088de9363349f6e5442007ba6134d092e25f5ba6ad2e4fedf8"
    },
    "expected_sender": "0xd4cf8e47beac55b42ae58991785fa326d9384bd1",
    "expected_recipient": "0x397ff1542f962076d0bfe58ea045ffa2d347aca0",
    "expected_fees": "30000000/997000000",
    "expected_volume": "10/1",
    "expected_emission": {
	"sushiswap": 0.03009027081243731
    },
    "rpc_methods": {
	"eth_getCode": "0x0"
    },
    "call_methods": {
    	"token0()": {
		    "": "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
	    },
    	"token1()": {
		    "": "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
	    }
    },
    "token_decimals": 6,
    "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  }
]
`
