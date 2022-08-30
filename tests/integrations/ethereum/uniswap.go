// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestUniswapV2 = `
[
  {
    "transfer": {
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAACz19e45lkP0loAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMVgkbc=",
        "address": "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x000000000000000000000000d7c09e006a2891880331b0f6224071c1e890a98a",
          "0x00000000000000000000000020e95253e54490d8d30ea41574b24f741ee70201"
        ]
      },
      "transaction": {
        "to": "0xd7c09e006a2891880331b0f6224071c1e890a98a",
        "from": "0x79328db8694a643c569740233869f4f5b344d0cf",
        "hash": "0x034f82fbb4c20783ee47a0251edeb8f44bda5fa6439dc15e19ee2e8a22862bb0"
      },
      "application": 1
    },
    "expected_sender": "0x79328db8694a643c569740233869f4f5b344d0cf",
    "expected_recipient": "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5",
    "expected_fees": "9934320933/997000000",
    "token_decimals": 6,
    "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  }
]
`
