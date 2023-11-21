// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

// WARNING: this is not a representative test of reality. this is a faux
// test for making sure our catch-all works. as such, the fees are 0

const integrationTraderJoe = `
[
    "transfer": {
      "transaction": "0x22e978cddf7f2f31c7572fb87d4634287d23424cc365f12eb2520297cfbe56d3",
      "log": {
        "data": "KkQ/rgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHoSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGuhxDvBUsl0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAHoI6qk8BavWuGuwmw9WXW/Eme41AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGVcUXQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAATPpQt850fi1hck/KxX8kt0j/KyoAAAAAAAAAAAAAAACRLOWRRBkcEgTmRVn+glOg5J5lSA==",
        "address": "0x3058ef90929cb8180174d74c507176cca6835d73",
        "topics": [
          "0xad7d6f97abf51ce18e17a38f4d70e975be9c0708474987bb3e26ad21bd93ca70"
        ],
	"log_index": "89"
      },
      "application": 8
    },
    "transaction": {
      "to": "0xb4315e873dbcf96ffd0acd8ea43f689d8c20fb30",
      "from": "0x7a08eaa93c05abd6b86bb09b0f565d6fc499ee35",
      "hash": "0x22e978cddf7f2f31c7572fb87d4634287d23424cc365f12eb2520297cfbe56d3"
    },
    "expected_sender": "0x7a08eaa93c05abd6b86bb09b0f565d6fc499ee35",
    "expected_recipient": "0x7a08eaa93c05abd6b86bb09b0f565d6fc499ee35",
    "expected_fees": "",
    "expected_volume": "",
    "expected_emission": {
	"trader_joe": 0
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 6,
    "contract_address": "0xdAC17F958D2ee523a2206206994597C13D831ec7"

`
