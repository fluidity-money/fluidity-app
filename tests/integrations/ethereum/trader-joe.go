// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestTraderJoe = `[
  {
    "transfer": {
      "transaction": "0x9cfe557706abf6c80320e6f6312a10a96d067e8a1f0f9df2cf3452566c9d2358",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAKzIAAAAAAAAAAB378HzmLGfsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIZV0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJxAAAAAAAAAAAAATRX/djOXYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPasyxPYSsAAAAAAAAAAAAAAAAAAAAA",
        "address": "0xb6a2a7456e651cc7ceb99735a086bff540e94d5d",
        "topics": [
          "0xad7d6f97abf51ce18e17a38f4d70e975be9c0708474987bb3e26ad21bd93ca70",
	  "0x000000000000000000000000b4315e873dbcf96ffd0acd8ea43f689d8c20fb30",
	  "0x000000000000000000000000aec109dcd8521d4e12a7ec04532cbf9ecaffcc52"
        ],
        "log_index": "12"
      },
      "application": 22
    },
    "transaction": {
      "to": "0xb6a2a7456e651cc7ceb99735a086bff540e94d5d",
      "from": "0xaec109dcd8521d4e12a7ec04532cbf9ecaffcc52",
      "hash": "0x9cfe557706abf6c80320e6f6312a10a96d067e8a1f0f9df2cf3452566c9d2358"
    },
    "expected_sender": "0xaec109dcd8521d4e12a7ec04532cbf9ecaffcc52",
    "expected_recipient": "0xb6a2a7456e651cc7ceb99735a086bff540e94d5d",
    "expected_fees": "678055004708027/125000000000000000",
    "expected_volume": "550237/250000",
    "expected_emission": {
      "trader_joe": 0.005424440037664216
    },
    "rpc_methods": {},
    "call_methods": {
	    "getTokenX()": {
		    "": "0x0000000000000000000000004cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
	    },
	    "getTokenY()": {
		    "": "0x000000000000000000000000912ce59144191c1204e64559fe8253a0e49e6548"
	    }
    },
    "token_decimals": 6,
    "contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
  }
]
`
