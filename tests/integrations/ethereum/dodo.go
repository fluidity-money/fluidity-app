// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestDodoV2 = `
[
  {
    "transfer": {
      "log": {
        "data": "AAAAAAAAAAAAAAAAaxdUdOiQlMRNqYuVTu3qxJUnHQ8AAAAAAAAAAAAAAADawX+VjS7lI6IgYgaZRZfBPYMexwAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaVqq/u0elKehAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY05GTYAAAAAAAAAAAAAAAAi+dz0ZHCE1sMbJ2X2kQzYXBeMGAAAAAAAAAAAAAAAACL53PRkcITWwxsnZfaRDNhcF4wY",
        "address": "0x3058ef90929cb8180174d74c507176cca6835d73",
        "topics": [
          "0xc2c0245e056d5fb095f04cd6373bc770802ebd1e6c918eb78fdef843cdb37b0f"
        ]
      },
      "transaction": {
        "to": "0xf42ecdc112365ff79a745b4cf7d4c266bd6e4b25",
        "from": "0x1c631824b0551fd0540a1f198c893b379d5cf3c3",
        "hash": "0x25b7270668070d0205efdf4408e1cd63d5defbd28158b6682b5a5915ba7b82e1"
      },
      "application": 7
    },
    "expected_sender": "0x1c631824b0551fd0540a1f198c893b379d5cf3c3",
    "expected_recipient": "0x3058ef90929cb8180174d74c507176cca6835d73",
    "expected_fees": "3332148379/2499500000",
    "token_decimals": 6,
    "contract_address": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  },
  {
    "transfer": {
      "log": {
        "data": "AAAAAAAAAAAAAAAAaxdUdOiQlMRNqYuVTu3qxJUnHQ8AAAAAAAAAAAAAAADawX+VjS7lI6IgYgaZRZfBPYMexwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALB7WEO+aaUcpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADCAArwAAAAAAAAAAAAAAABBaEs2FVfpKC4Dc8pRJg2TMeUYyQAAAAAAAAAAAAAAAEFoSzYVV+koLgNzylEmDZMx5RjJ",
        "address": "0x3058ef90929cb8180174d74c507176cca6835d73",
        "topics": [
          "0xc2c0245e056d5fb095f04cd6373bc770802ebd1e6c918eb78fdef843cdb37b0f"
        ]
      },
      "transaction": {
        "to": "0x617dee16b86534a5d792a4d7a62fb491b544111e",
        "from": "0xfd3f1d1f95481f91404f2042855686d42bd8a07e",
        "hash": "0x5edb9c16eaef3a089825a92c1a19dd8d3953107f0c160068d0d35e521983745e"
      },
      "application": 7
    },
    "expected_sender": "0xfd3f1d1f95481f91404f2042855686d42bd8a07e",
    "expected_recipient": "0x3058ef90929cb8180174d74c507176cca6835d73",
    "expected_fees": "813878721330648008489/5000000000000000000000",
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
      "transfer": {
        "log": {
          "data": "AAAAAAAAAAAAAAAAaxdUdOiQlMRNqYuVTu3qxJUnHQ8AAAAAAAAAAAAAAADawX+VjS7lI6IgYgaZRZfBPYMexwAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaoqRQ5FuPlC6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY6Hh9QAAAAAAAAAAAAAAAAi+dz0ZHCE1sMbJ2X2kQzYXBeMGAAAAAAAAAAAAAAAACL53PRkcITWwxsnZfaRDNhcF4wY",
          "address": "0x3058ef90929cb8180174d74c507176cca6835d73",
          "topics": [
            "0xc2c0245e056d5fb095f04cd6373bc770802ebd1e6c918eb78fdef843cdb37b0f"
          ]
      },
      "transaction": {
          "to": "0xf42ecdc112365ff79a745b4cf7d4c266bd6e4b25",
        "from": "0x1c631824b0551fd0540a1f198c893b379d5cf3c3",
        "hash": "0x399aa69329ee1c156bd7584eac2afba9bed70cf3b31a237705ddbee80dcd3b75"
      },
      "application": 7
    },
    "expected_sender": "0x1c631824b0551fd0540a1f198c893b379d5cf3c3",
    "expected_recipient": "0x3058ef90929cb8180174d74c507176cca6835d73",
    "expected_fees": "133754123816472273637/100000000000000000000",
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
      "transfer": {
        "log": {
          "data": "AAAAAAAAAAAAAAAAaxdUdOiQlMRNqYuVTu3qxJUnHQ8AAAAAAAAAAAAAAADawX+VjS7lI6IgYgaZRZfBPYMexwAAAAAAAAAAAAAAAAAAAAAAAAAAAAABayQmFgouQmLUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY8wrvMAAAAAAAAAAAAAAAAi+dz0ZHCE1sMbJ2X2kQzYXBeMGAAAAAAAAAAAAAAAACL53PRkcITWwxsnZfaRDNhcF4wY",
          "address": "0x3058ef90929cb8180174d74c507176cca6835d73",
          "topics": [
            "0xc2c0245e056d5fb095f04cd6373bc770802ebd1e6c918eb78fdef843cdb37b0f"
          ]
      },
      "transaction": {
          "to": "0xf42ecdc112365ff79a745b4cf7d4c266bd6e4b25",
        "from": "0x1c631824b0551fd0540a1f198c893b379d5cf3c3",
        "hash": "0x181c74fa2b22faffce7ba7498719bf5d314682c536f138f4dfc6cae31e054b31"
      },
      "application": 7
    },
    "expected_sender": "0x1c631824b0551fd0540a1f198c893b379d5cf3c3",
    "expected_recipient": "0x3058ef90929cb8180174d74c507176cca6835d73",
    "expected_fees": "6697299699/4999000000",
    "token_decimals": 6,
    "contract_address": "0xdac17f958d2ee523a2206206994597c13d831ec7"
  }
]
`
