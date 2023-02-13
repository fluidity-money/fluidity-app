// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestUniswapV2 = `
[
  {
    "transfer": {
      "transaction": "0x034f82fbb4c20783ee47a0251edeb8f44bda5fa6439dc15e19ee2e8a22862bb0",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAACz19e45lkP0loAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMVgkbc=",
        "address": "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x000000000000000000000000d7c09e006a2891880331b0f6224071c1e890a98a",
          "0x00000000000000000000000020e95253e54490d8d30ea41574b24f741ee70201"
        ]
      },
      "application": 1
    },
    "transaction": {
      "to": "0xd7c09e006a2891880331b0f6224071c1e890a98a",
      "from": "0x79328db8694a643c569740233869f4f5b344d0cf",
      "hash": "0x034f82fbb4c20783ee47a0251edeb8f44bda5fa6439dc15e19ee2e8a22862bb0"
    },
    "expected_sender": "0x79328db8694a643c569740233869f4f5b344d0cf",
    "expected_recipient": "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5",
    "expected_fees": "9934320933/997000000",
    "expected_emission": {
      "uniswap_v2": 9.964213573721164
    },
    "rpc_methods": {
      "eth_getCode": "0x0"
    },
    "call_methods": {
      "token0()": "0x0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f"
    },
    "token_decimals": 6,
    "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  }
]
`

const integrationTestUniswapV3 = `
[
  {
    "transfer": {
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGA5EselnlwAAD////////////////////////////////////+WNlDJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQxvh7mCN4sTZSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgi1gZVSHXISPj///////////////////////////////////////vImw",
        "address": "0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168",
        "topics": [
          "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
          "0x000000000000000000000000ef1c6e67703c7bd7107eed8303fbe6ec2554bf6b",
          "0x00000000000000000000000035f09f57fd5c6106da70f4ed8e14312614747efc"
        ]
      },
      "transaction": {
        "to": "0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B",
        "from": "0x35f09F57fd5C6106Da70f4Ed8e14312614747Efc",
        "hash": "0xdaaeff3d62cbbfb33eefe48190498ccc280cbee3ce5af85e9e3e2fc92d04d5e6"
      },
      "application": 2
    },
    "expected_sender": "0x35f09F57fd5C6106Da70f4Ed8e14312614747Efc",
    "expected_recipient": "0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B",
    "expected_fees": "7099301083/999000000",
    "expected_emission": {
      "uniswap_v3": 7.1064076
    },
    "rpc_methods": {
      "eth_getCode": "0x0"
    },
    "call_methods": {
      "token0()": "0x0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f",
      "fee()": "0x0000000000000000000000000000000000000000000000000000000000000064"
    }
    "token_decimals": 6,
    "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  }
]
`
