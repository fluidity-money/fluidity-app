// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestOdos = `[
  {
    "transfer": {
      "transaction": "0xa40f326506b6c38d272962d30ec11b1199470b2a2aa2c6e2183c3971adfaef38",
      "log": {
        "data": "AAAAAAAAAAAAAAAA62uIKildMWrGLIz8yBw+N8CEt8UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9CQAAAAAAAAAAAAAAAAEz6ULfOdH4tYXJPysV/JLdI/ysqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPOPYAAAAAAAAAAAAAAACviNBl53yMwiOTJ8Xts6QyJo5YMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdWtbM=",
        "address": "0xa669e7a0d4b3e4fa48af2de86bd4cd7126be4e13",
        "topics": [
          "0x823eaf01002d7353fbcadb2ea3305cc46fa35d799cb0914846d185ac06f8ad05"
        ],
        "log_index": "12"
      },
      "application": 27
    },
    "transaction": {
      "to": "0xa669e7a0d4b3e4fa48af2de86bd4cd7126be4e13",
      "from": "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5",
      "hash": "0xa40f326506b6c38d272962d30ec11b1199470b2a2aa2c6e2183c3971adfaef38"
    },
    "expected_sender": "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5",
    "expected_recipient": "0xa669e7a0d4b3e4fa48af2de86bd4cd7126be4e13",
    "expected_fees": "0/1",
    "expected_volume": "1/1",
    "expected_emission": {
      "odos": 0
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 6,
    "contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
  }
]
`
