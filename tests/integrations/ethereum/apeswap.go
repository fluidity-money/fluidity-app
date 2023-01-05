// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestApeSwap = `
[
  {
    "transfer": {
      "transaction": "0x645dc6e15a69196d3c74ea63487009d2fab1d0df6ff6437e1785e07aaafa63ee",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiscjBInoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtkdyLvYJU=",
        "address": "0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
          "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"
        ]
      },
      "application": 11
    },
    "transaction": {
      "to": "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
      "from": "0xd4cf8e47beac55b42ae58991785fa326d9384bd1",
      "hash": "0x645dc6e15a69196d3c74ea63487009d2fab1d0df6ff6437e1785e07aaafa63ee"
    },
    "expected_sender": "0xd4cf8e47beac55b42ae58991785fa326d9384bd1",
    "expected_recipient": "0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f",
    "expected_fees": "2/100",
	"expected_emission": {
		"apeswap": 0.02
	},
	"rpc_methods": {
		"eth_getCode": "0x0"
	},
	"call_methods": {
		"token0()": "0x0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f",
		"token1()": "0x000000000000000000000000C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
	},
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "transfer": {
      "transaction": "0x59cd90de6da2f47603d6718d0d091eec181f8edfb339f26b895a257c754a52fd",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJiWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIp3lRZiNBiFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        "address": "0xaaf5110db6e744ff70fb339de037b990a20bdace",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
          "0xD4CF8e47BeAC55b42Ae58991785Fa326d9384Bd1"
        ]
      },
      "application": 11
    },
    "transaction": {
      "to": "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
      "from": "0xd4cf8e47beac55b42ae58991785fa326d9384bd1",
      "hash": "0x59cd90de6da2f47603d6718d0d091eec181f8edfb339f26b895a257c754a52fd"
    },
    "expected_sender": "0xd4cf8e47beac55b42ae58991785fa326d9384bd1",
    "expected_recipient": "0xaaf5110db6e744ff70fb339de037b990a20bdace",
    "expected_fees": "9977607422832023685/500000000000000000000",
	"expected_emission": {
		"apeswap": 0.019955214845664048
	},
	"rpc_methods": {
		"eth_getCode": "0x0"
	},
	"call_methods": {
		"token0()": "0x0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f",
		"token1()": "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
	},
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "transfer": {
      "transaction": "0x399f63f0832af79554118119990c01a549ab004a39ebea99a295db3047497c29",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG4tRfmsLPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmJaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        "address": "0x6b0cc136f7babd971b5decd21690be65718990e2",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x5f509a3C3F16dF2Fba7bF84dEE1eFbce6BB85587",
          "0xD4CF8e47BeAC55b42Ae58991785Fa326d9384Bd1"
        ]
      },
      "application": 11
    },
    "transaction": {
      "to": "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
      "from": "0xd4cf8e47beac55b42ae58991785fa326d9384bd1",
      "hash": "0x399f63f0832af79554118119990c01a549ab004a39ebea99a295db3047497c29"
    },
    "expected_sender": "0xd4cf8e47beac55b42ae58991785fa326d9384bd1",
    "expected_recipient": "0x6b0cc136f7babd971b5decd21690be65718990e2",
    "expected_fees": "2/100",
	"expected_emission": {
		"apeswap": 0.02
	},
	"rpc_methods": {
		"eth_getCode": "0x0"
	},
	"call_methods": {
		"token0()": "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
		"token1()": "0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
	},
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  }
]
`
