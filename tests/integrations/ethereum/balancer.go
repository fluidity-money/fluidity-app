package main

const integrationTestBalancerV2 = `
[
  {
    "transfer": {
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
      "transaction": {
        "to": "0x00000000ae347930bd1e7b0f35588b92280f9e75",
        "from": "0x00000042d2d0aa64e0505a13eacdc9984a024322",
        "hash": "0xac495e8c4513c051df513c72808ed026c0147603ebc4be90e3772919e079dee0"
      },
      "application": 2
    },
    "expected_sender": "0x00000042d2d0aa64e0505a13eacdc9984a024322",
    "expected_recipient": "0xba12222222228d8ba445958a75a0704d566bf2c8",
    "expected_fees": "1011539568884332906251/999500000000000000000",
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "transfer": {
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
      "transaction": {
        "to": "0xba12222222228d8ba445958a75a0704d566bf2c8",
        "from": "0x054ba12713290ef5b9236e55944713c0edeb4cf4",
        "hash": "0xc81559d58d826401d035aefd7843f778eba0bfe78bb2d93c16aeae2c9ed53562"
      },
      "application": 2
    },
    "expected_sender": "0x054ba12713290ef5b9236e55944713c0edeb4cf4",
    "expected_recipient": "0xba12222222228d8ba445958a75a0704d566bf2c8",
    "expected_fees": "75/4",
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  },
  {
    "transfer": {
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
      "transaction": {
        "to": "0xba12222222228d8ba445958a75a0704d566bf2c8",
        "from": "0x1ca484dbdafad7e940f5073f6fcc5e87cd24202b",
        "hash": "0x744c83b11300d8bfd6bd0dea0958fab802188effef6b2f96b0861e6746a9a977"
      },
      "application": 2
    },
    "expected_sender": "0x1ca484dbdafad7e940f5073f6fcc5e87cd24202b",
    "expected_recipient": "0xba12222222228d8ba445958a75a0704d566bf2c8",
    "expected_fees": "222/25",
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "transfer": {
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
      "transaction": {
        "to": "0xba12222222228d8ba445958a75a0704d566bf2c8",
        "from": "0xdec08cb92a506b88411da9ba290f3694be223c26",
        "hash": "0xd4f746826f2221a66d370f6b3e8695124b894a349d8927cb107269d2c8a9dfa0"
      },
      "application": 2
    },
    "expected_sender": "0xdec08cb92a506b88411da9ba290f3694be223c26",
    "expected_recipient": "0xba12222222228d8ba445958a75a0704d566bf2c8",
    "expected_fees": "25/2",
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  },
  {
    "transfer": {
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
      "transaction": {
        "to": "0xba12222222228d8ba445958a75a0704d566bf2c8",
        "from": "0xd6b1fbcbe39e33a3d5d9014b024f511be3564ee5",
        "hash": "0x7573a3928fc1a42877d846d314789999560b5f3e4259d36bca5473b35beeb762"
      },
      "application": 2
    },
    "expected_sender": "0xd6b1fbcbe39e33a3d5d9014b024f511be3564ee5",
    "expected_recipient": "0xba12222222228d8ba445958a75a0704d566bf2c8",
    "expected_fees": "197042747/4999000000",
    "token_decimals": 6,
    "contract_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  }
]
`