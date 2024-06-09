// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestPancakeswap = `[
  {
    "transfer": {
      "transaction": "0xcec460b14b3b11e8dbb0e8afda4a3189faea78836a60cb324abfebce32ffa304",
      "log": {
        "data": "Mjc5MDk1MTExNjI3ODUyMzc2NDA3ODIyNjczOTE4MDY1MDcyOTA1ODg3OTM1MzQ1NjYwMjUyNjE1OTg5NTE5NDg4MDI5NjEyMzY1NjkxNDE3Nzk0NjMzMzExMzE1MjcwODMxOTMzNzYyMDIxNjcxNDk4NDYyMzM3ODgxMjUxNjk2OTAxODI5MzQxNTI4NDY1NDY2ODgzNjYxMjk4MTg0MzY1NjQ2OTM4MDQ1MzgyMjIxNzY3NDM2NDk5NTQ4MDUzMDg0NjkzNDIxODAzNTI5MzgyNzg3MTAxNzgwODk0Mzk3MjM3MTAwMDk0MjEzMTA1ODYyMjc2NTg3OTk5OTE0NjY3MzY0NDM1NzUwMjY5ODc1MjI1NzUwMjA1NTE4NzUzMTUxNzk4MzY1MTYzOTc2NzQ4NDEwNzkxMDA0ODQ5MDYwMDA0ODY1NzM0NTgyMzYxNTE5MzQ3MjQ5MTQ2MjY3NzI4MTIwMzMxODI5NzY1NDQwMjA5NDA5Njc2MTY1NjI5NTgxOTYyMDcxMTQwNDU0MTIwNjUzMDMwNjI0MzI4MDkwNzY5MzY5MjIxOTc5NzI5MjE2NjYxNTk4NTU2MzQ1MzIwMjk1NjQxNzUyMzMxNzQyNjg2Nzc2NTUzMzU0OTc3ODUyMzkxOTIzNTU2Nzk1MTc3OTk4MjQzNzgwODI2NTIxNzMyOTQ4NDU2ODIyNTcxNDI1MzMzMjQ4NjY5Cg==",
        "address": "0x38437dbfd1d6a147a50cd0991a9581ac8f996892",
        "topics": [
          "0x19b47279256b2a23a1665c810c8d55a1758940ee09377d4f8d26497a3577dc83",
          "0x000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09",
          "0x0000000000000000000000001111111254eeb25477b68fb85ed929f73a960582"
        ],
        "log_index": "6"
      },
      "application": 30
    },
    "transaction": {
      "to": "0x38437dbfd1d6a147a50cd0991a9581ac8f996892",
      "from": "0x6ebcd1bffb2d6be2efc3c33f09250a95745b7bb1",
      "hash": "0xcec460b14b3b11e8dbb0e8afda4a3189faea78836a60cb324abfebce32ffa304"
    },
    "expected_sender": "0x6ebcd1bffb2d6be2efc3c33f09250a95745b7bb1",
    "expected_recipient": "0x38437dbfd1d6a147a50cd0991a9581ac8f996892",
    "expected_fees": "0/1",
    "expected_volume": "20293184/1",
    "expected_emission": {
      "pancakeswap": 0
    },
    "rpc_methods": {},
    "call_methods": {
	    "token0()": {
		    "": "0x0000000000000000000000004CFA50B7Ce747e2D61724fcAc57f24B748FF2b2A"
	    },
	    "token1()": {
		    "": "0x000000000000000000000000af88d065e77c8cC2239327C5EDb3A432268e5831"
	    }
    },
    "token_decimals": 6,
    "contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
  }
]
`
