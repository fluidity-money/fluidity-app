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
  },
  {
    "transfer": {
      "transaction": "0x8d07492567d8e01513482e17a7c2350b6918bba586deaf20fb6f907f58776b16",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzx3PcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADPOPxQ==",
        "address": "0xa7f8207bbea17e44cdc5238cb03c03eacefba314",
        "topics": [
          "0xcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e46062",
          "0x000000000000000000000000fc506aaa1340b4dedffd88be278bee058952d674",
          "0x000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc8",
	  "0x0000000000000000000000004cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
        ]
      },
     "application": 18
    },
    "transaction": {
      "to": "0xfc506aaa1340b4dedffd88be278bee058952d674",
      "from": "0x475681f0e12606cf8f97743c1d4558c06a287840",
      "hash": "0x8d07492567d8e01513482e17a7c2350b6918bba586deaf20fb6f907f58776b16"
    },
    "expected_sender": "0x475681f0e12606cf8f97743c1d4558c06a287840",
    "expected_recipient": "0xa7f8207bbea17e44cdc5238cb03c03eacefba314",
    "expected_fees": "43435467/400000000",
    "expected_volume": "43435467/200000",
    "expected_emission": {
	"sushiswap": 0.1085886675
    },
    "rpc_methods": {
	"eth_getCode": "0x0"
    },
    "call_methods": {
    	"token0()": {
		    "": "0x0000000000000000000000004cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
	    },
    	"token1()": {
		    "": "0x000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc8"
	    },
	"swapFee()": {
	 	    "": "0x0000000000000000000000000000000000000000000000000000000000000005"
	},
	"decimals0()": {
	 	    "": "0x00000000000000000000000000000000000000000000000000000000000f4240"
	},
	"decimals1()": {
	 	    "": "0x00000000000000000000000000000000000000000000000000000000000f4240"
	}
    },
    "token_decimals": 6,
    "contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
  },
  {
    "transfer": {
      "transaction": "0x1b6fd9b81846dcfc73ec3af1a34dbd005bb3085713460abcf73151651317a152",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcgUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ewjvtAQg==",
        "address": "0xbaff0f830ab2d327925e5f1ed3c4772a80c0aaa9",
        "topics": [
          "0xcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e46062",
          "0x000000000000000000000000fc506aaa1340b4dedffd88be278bee058952d674",
          "0x0000000000000000000000004cfa50b7ce747e2d61724fcac57f24b748ff2b2a",
	  "0x00000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1"
        ]
      },
     "application": 18
    },
    "transaction": {
      "to": "0xfc506aaa1340b4dedffd88be278bee058952d674",
      "from": "0x708f741b5fa76c9f4a70355207b4f0226ce265f3",
      "hash": "0x1b6fd9b81846dcfc73ec3af1a34dbd005bb3085713460abcf73151651317a152"
    },
    "expected_sender": "0x708f741b5fa76c9f4a70355207b4f0226ce265f3",
    "expected_recipient": "0xbaff0f830ab2d327925e5f1ed3c4772a80c0aaa9",
    "expected_fees": "29189/31250000",
    "expected_volume": "29189/15625",
    "expected_emission": {
	"sushiswap": 0.000934048
    },
    "rpc_methods": {
	"eth_getCode": "0x0"
    },
    "call_methods": {
    	"token0()": {
		    "": "0x0000000000000000000000004cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
	    },
    	"token1()": {
		    "": "0x00000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1"
	    },
	"swapFee()": {
	 	    "": "0x0000000000000000000000000000000000000000000000000000000000000005"
	},
	"decimals()": {
	 	    "": "0x0000000000000000000000000000000000000000000000000000000000000012"
	}
    },
    "token_decimals": 6,
    "contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
  }
]
`
