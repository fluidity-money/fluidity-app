// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestKyberClassic = `
[
  {
    "transfer": {
      "transaction": "0x954a7236456b23109f3a77ad655b2684d6494cb2aeef6ade1dd5bc2d67c646cc",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnWPsQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOf9zMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEjCc5UAAA==",
        "address": "0x38bdc8c37f2f710c7035ca1b24be226676c79ae6",
        "topics": [
          "0x606ecd02b3e3b4778f8e97b2e03351de14224efaa5fa64e62200afc9395c2499",
          "0000000000000000000000000caa00aaf6fbc769d627d825b4faedc3aad880597",
          "0x000000000000000000000000176416bdc885b1bb751b0a014d495760a972a73"
        ]
      },
      "application": 19
    },
    "transaction": {
      "to": "0x6131b5fae19ea4f9d964eac0408e4408b66337b5",
	  "from": "0x4c3fcb1505686a99aa5767c8a98192d86a1e8604",
	  "hash": "0x954a7236456b23109f3a77ad655b2684d6494cb2aeef6ade1dd5bc2d67c646cc"
    },
    "rpc_methods": {
    },
    "call_methods": {
      "token0()": {
        "": "0x0000000000000000000000004cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
      },
	  "token1()": {
        "": "0x000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc8"
      }
    },
    "expected_sender": "0x4c3fcb1505686a99aa5767c8a98192d86a1e8604",
    "expected_recipient": "0x38bdc8c37f2f710c7035ca1b24be226676c79ae6",
    "expected_fees": "12163031/624950000",
    "expected_volume": "12163031/50000",
    "token_decimals": 6,
    "contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a",
    "expected_emission": {
	  "kyber_classic": 0.019462406592527404
    }
  },
  {
    "transfer": {
      "transaction": "0x499854bc6231bb4a223c43d744aee6ef4d6d98e320d2c91ba4d048fbaf66ddad",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADszi5EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADsJT3UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEjCc5UAAA==",
        "address": "0x38bdc8c37f2f710c7035ca1b24be226676c79ae6",
        "topics": [
          "0x606ecd02b3e3b4778f8e97b2e03351de14224efaa5fa64e62200afc9395c2499",
          "0000000000000000000000000454c8b4dc6a2affe669a3db1633133f7d305e305",
          "0x00000000000000000000000454c8b4dc6a2affe669a3db1633133f7d305e305"
        ]
      },
      "application": 19
    },
    "transaction": {
      "to": "0xc207dd924cf4f0084363eb2f83b10aabaeef5d42",
	  "from": "0xe8884170825497716ef8988e953040229426ec23",
	  "hash": "0x499854bc6231bb4a223c43d744aee6ef4d6d98e320d2c91ba4d048fbaf66ddad"
    },
    "rpc_methods": {
    },
    "call_methods": {
      "token0()": {
        "": "0x0000000000000000000000004cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
      },
	  "token1()": {
        "": "0x000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc8"
      }
    },
    "expected_sender": "0xe8884170825497716ef8988e953040229426ec23",
    "expected_recipient": "0x38bdc8c37f2f710c7035ca1b24be226676c79ae6",
    "expected_fees": "993233809/12500000000",
    "expected_volume": "993233809/1000000",
    "token_decimals": 6,
    "contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a",
    "expected_emission": {
	  "kyber_classic": 0.07945870472
    }
  }
]
`
