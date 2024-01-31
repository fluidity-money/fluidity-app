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
          "0xad7d6f97abf51ce18e17a38f4d70e975be9c0708474987bb3e26ad21bd93ca70",
	  "0x000000000000000000000000b4315e873dbcf96ffd0acd8ea43f689d8c20fb30",
	  "0x000000000000000000000000aec109dcd8521d4e12a7ec04532cbf9ecaffcc52"
        ],
        "log_index": "12"
      },
      "application": 26
    },
    "transaction": {
      "to": "0xa669e7a0d4b3e4fa48af2de86bd4cd7126be4e13",
      "from": "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5",
      "hash": "0xa40f326506b6c38d272962d30ec11b1199470b2a2aa2c6e2183c3971adfaef38"
    },
    "expected_sender": "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5",
    "expected_recipient": "0xa669e7a0d4b3e4fa48af2de86bd4cd7126be4e13",
    "expected_fees": "678055004708027/125000000000000000",
    "expected_volume": "550237/250000",
    "expected_emission": {
      "odos": 0
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 6,
    "contract_address": "0xa669e7a0d4b3e4fa48af2de86bd4cd7126be4e13"
  }
]
`
