// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestBalancerV2 = `
[
  {
    "transfer": {
      "transaction": "0xac495e8c4513c051df513c72808ed026c0147603ebc4be90e3772919e079dee0",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGKIjNCTLvQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG2r3O0RZOCOFg==",
        "address": "0xba12222222228d8ba445958a75a0704d566bf2c8",
        "topics": [
          "0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b",
          "0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a",
          "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          "0x6b175474e89094c44da98b954eedeac495271d0f"
        ]
      },
      "application": 2
    },
    "transaction": {
      "to": "0x00000000ae347930bd1e7b0f35588b92280f9e75",
      "from": "0x00000042d2d0aa64e0505a13eacdc9984a024322",
      "hash": "0xac495e8c4513c051df513c72808ed026c0147603ebc4be90e3772919e079dee0"
    },
    "expected_sender": "0x00000042d2d0aa64e0505a13eacdc9984a024322",
    "expected_recipient": "0xba12222222228d8ba445958a75a0704d566bf2c8",
    "expected_fees": "1011539568884332906251/999500000000000000000",
	"expected_emission": {
		"balancer_v2": 1.012045591680173
	},
	"rpc_methods": {
		"eth_getCode": "0x0"
	},
	"call_methods": {
		"getSwapFeePercentage()": "0x0000000000000000000000000000000000000000000000000001c6bf526340000000000000000000000000000000000000000000000000000000000000000000",
		"getPool(bytes32)": "0x0000000000000000000000000b09dea16768f0799065c475be02919503cb2a350000000000000000000000000000000000000000000000000000000000000002"
	},
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "transfer": {
      "transaction": "0xc81559d58d826401d035aefd7843f778eba0bfe78bb2d93c16aeae2c9ed53562",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABdIdugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEW47YdXk4Qrg==",
        "address": "0xba12222222228d8ba445958a75a0704d566bf2c8",
        "topics": [
          "0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b",
          "0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8000200000000000000000019",
          "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        ]
      },
      "application": 2
    },
    "transaction": {
      "to": "0xba12222222228d8ba445958a75a0704d566bf2c8",
      "from": "0x054ba12713290ef5b9236e55944713c0edeb4cf4",
      "hash": "0xc81559d58d826401d035aefd7843f778eba0bfe78bb2d93c16aeae2c9ed53562"
    },
    "expected_sender": "0x054ba12713290ef5b9236e55944713c0edeb4cf4",
    "expected_recipient": "0xba12222222228d8ba445958a75a0704d566bf2c8",
    "expected_fees": "75/4",
    "expected_emission": {
      "balancer_v2": 18.75
    },
    "rpc_methods": {
      "eth_getCode": "0x0"
    },
    "call_methods": {
      "getSwapFeePercentage()": "0x0000000000000000000000000000000000000000000000000002aa1efb94e0000000000000000000000000000000000000000000000000000000000000000000",
      "getPool(bytes32)": "0x00000000000000000000000096646936b91d6b9d7d0c47c496afbf3d6ec7b6f80000000000000000000000000000000000000000000000000000000000000002"
    },
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  },
  {
    "transfer": {
      "transaction": "0x744c83b11300d8bfd6bd0dea0958fab802188effef6b2f96b0861e6746a9a977",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVrx14tYxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMMfCUmAPnKQ==",
        "address": "0xba12222222228d8ba445958a75a0704d566bf2c8",
        "topics": [
          "0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b",
          "0xc06764e3def91ca6abdccb18e4c27a87d1f0f6f6000200000000000000000294",
          "0x6b175474e89094c44da98b954eedeac495271d0f",
          "0x676495371d5107f870e0e7d5afb6fed91f236f21"
        ]
      },
      "application": 2
    },
    "transaction": {
      "to": "0xba12222222228d8ba445958a75a0704d566bf2c8",
      "from": "0x1ca484dbdafad7e940f5073f6fcc5e87cd24202b",
      "hash": "0x744c83b11300d8bfd6bd0dea0958fab802188effef6b2f96b0861e6746a9a977"
    },
    "expected_sender": "0x1ca484dbdafad7e940f5073f6fcc5e87cd24202b",
    "expected_recipient": "0xba12222222228d8ba445958a75a0704d566bf2c8",
    "expected_fees": "222/25",
    "expected_emission": {
      "balancer_v2": 8.88
    },
    "rpc_methods": {
      "eth_getCode": "0x0"
    },
    "call_methods": {
      "getSwapFeePercentage()": "0x000000000000000000000000000000000000000000000000004edec84a0380000000000000000000000000000000000000000000000000000000000000000000",
      "getPool(bytes32)": "0x00000000000000000000000096646936b91d6b9d7d0c47c496afbf3d6ec7b6f80000000000000000000000000000000000000000000000000000000000000002"
    },
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "transfer": {
      "transaction": "0xd4f746826f2221a66d370f6b3e8695124b894a349d8927cb107269d2c8a9dfa0",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3NZQAAAAAAAAAAAAAAAAAAAAAAAAAAbwNVyL7OufoNbDxvbg==",
        "address": "0xba12222222228d8ba445958a75a0704d566bf2c8",
        "topics": [
          "0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b",
          "0xffa3209e32658e48fcdfc0c918e4678d61ee07c1000200000000000000000298",
          "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          "0xbd72ae3bb5da3cb770c75d217b83f4d838306565"
        ]
      },
      "application": 2
    },
    "transaction": {
      "to": "0xba12222222228d8ba445958a75a0704d566bf2c8",
      "from": "0xdec08cb92a506b88411da9ba290f3694be223c26",
      "hash": "0xd4f746826f2221a66d370f6b3e8695124b894a349d8927cb107269d2c8a9dfa0"
    },
    "expected_sender": "0xdec08cb92a506b88411da9ba290f3694be223c26",
    "expected_recipient": "0xba12222222228d8ba445958a75a0704d566bf2c8",
    "expected_fees": "25/2",
    "expected_emission": {
      "balancer_v2": 12.5
    },
    "rpc_methods": {
      "eth_getCode": "0x0"
    },
    "call_methods": {
      "getSwapFeePercentage()": "0x0000000000000000000000000000000000000000000000000058d15e176280000000000000000000000000000000000000000000000000000000000000000000",
      "getPool(bytes32)": "0x000000000000000000000000ffa3209e32658e48fcdfc0c918e4678d61ee07c10000000000000000000000000000000000000000000000000000000000000002"
    },
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  },
  {
    "transfer": {
      "transaction": "0x7573a3928fc1a42877d846d314789999560b5f3e4259d36bca5473b35beeb762",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKlCK8rM6U3kEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC76iOw==",
        "address": "0xba12222222228d8ba445958a75a0704d566bf2c8",
        "topics": [
          "0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b",
          "0x9210f1204b5a24742eba12f710636d76240df3d00000000000000000000000fc",
          "0x9210f1204b5a24742eba12f710636d76240df3d0",
          "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
        ]
      },
      "application": 2
    },
    "transaction": {
      "to": "0xba12222222228d8ba445958a75a0704d566bf2c8",
      "from": "0xd6b1fbcbe39e33a3d5d9014b024f511be3564ee5",
      "hash": "0x7573a3928fc1a42877d846d314789999560b5f3e4259d36bca5473b35beeb762"
    },
    "expected_sender": "0xd6b1fbcbe39e33a3d5d9014b024f511be3564ee5",
    "expected_recipient": "0xba12222222228d8ba445958a75a0704d566bf2c8",
    "expected_fees": "197042747/4999000000",
    "expected_emission": {
      "balancer_v2": 0.03941643268653731
    },
    "rpc_methods": {
      "eth_getCode": "0x0"
    },
    "call_methods": {
      "getSwapFeePercentage()": "0x0000000000000000000000000000000000000000000000000000b5e620f480000000000000000000000000000000000000000000000000000000000000000000",
      "getPool(bytes32)": "0x0000000000000000000000009210f1204b5a24742eba12f710636d76240df3d00000000000000000000000000000000000000000000000000000000000000000"
    },
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  }
]
`
