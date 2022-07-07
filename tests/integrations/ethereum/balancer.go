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
  }
]
`