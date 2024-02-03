// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

// integrationTestParaswap is tested with a fluid test that ends with a
// SwappedV3 transaction, and then another transaction not related to us
// for Magic Internet Money
const integrationTestParaswap = `[
  {
    "transfer": {
      "transaction": "",
      "log": {
        "data": "Cha2svS0RqG5qXUFNh0BFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1PS0Uu2dIkpEGhVIKwED1YMy8BgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxOIAAAAAAAAAAAAAAAASe652YeoC+f48Cp+F7enCTX63yYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFyw/OgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEXOr40AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARc6vjQ=",
        "address": "0xdef171fe48cf0115b1d80b88dc8eab59176fee57",
        "topics": [
          "0xe00361d207b252a464323eb23d45d42583e391f2031acdd2e9fa36efddd43cb0",
          "0x00000000000000000000000049eeb9d987a80be7f8f02a7e17b7a70935fadf26",
          "0x000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e5831",
          "0x0000000000000000000000004cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
        ],
        "log_index": "7"
      },
      "application": 29
    },
    "transaction": {
      "to": "0xdef171fe48cf0115b1d80b88dc8eab59176fee57",
      "from": "0x49eeb9d987a80be7f8f02a7e17b7a70935fadf26",
      "hash": "0xccd4b011feaa198e4f5fe9e6247989f70513c27e9a702c67e9b8844d1b76551d"
    },
    "expected_sender": "0x49eeb9d987a80be7f8f02a7e17b7a70935fadf26",
    "expected_recipient": "0xdef171fe48cf0115b1d80b88dc8eab59176fee57",
    "expected_fees": "0/1",
    "expected_volume": "1171173261/250000",
    "expected_emission": {
      "paraswap": 0
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 6,
    "contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
  },
  {
    "transfer": {
      "transaction": "",
      "log": {
        "data": "QY9YVL0oTx2JtpAgGRXN1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAZgDvDJ9fcPdE7UBwTnDa3usfXyMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeXZJibJugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3gtrOnZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHl2SYmybs=",
        "address": "0xdef171fe48cf0115b1d80b88dc8eab59176fee57",
        "topics": [
					"0x4cc7e95e48af62690313a0733e93308ac9a73326bc3c29f1788b1191c376d5b6",
					"0x0000000000000000000000006600ef0c9f5f70f744ed40704e70dadeeb1f5f23",
					"0x000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
					"0x000000000000000000000000fea7a6a0b346362bf88a9e4a88416b77a57d6c2a"
				],
        "log_index": "25"
      },
      "application": 29
    },
    "transaction": {
      "to": "0xdef171fe48cf0115b1d80b88dc8eab59176fee57",
      "from": "0x6600ef0c9f5f70f744ed40704e70dadeeb1f5f23",
      "hash": "0xff48614df1579a5df07bfe58da874b40ff42b4ce58aadd44751d8599a48de884"
    },
    "expected_sender": "0x6600ef0c9f5f70f744ed40704e70dadeeb1f5f23",
    "expected_recipient": "0xdef171fe48cf0115b1d80b88dc8eab59176fee57",
    "expected_fees": "0/1",
    "expected_volume": "1/1",
    "expected_emission": {
      "paraswap": 0
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 18,
    "contract_address": "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a"
  }
]`
