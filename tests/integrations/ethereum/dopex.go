// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestDopex = `
[
  {
    "transfer": {
      "transaction": "0xee8b737c8ada56c3eb3e8fab9d8be1db02c799a15666bc38e6e90701ad1c4573",
      "log": {
        "data": "AAAAAAAAAAAAAAAAIVtbJad3sgnCG67jpoAzt0Y36ukAAAAAAAAAAAAAAACguGmRxiGLNsHRnUounrDONgbrSAAAAAAAAAAAAAAAANrBf5WNLuUjoiBiBplFl8E9gx7HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9OnQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2o8",
        "address": "0xD62707f513F4B472d0BaDd922D74c49e06d9e7c7",
        "topics": [
          "0xd6d34547c69c5ee3d2667625c188acf1006abb93e0ee7cf03925c67cf7760413"
        ]
      },
      "application": 13
    },
    "transaction": {
      "to": "0xD62707f513F4B472d0BaDd922D74c49e06d9e7c7",
      "from": "0x215b5b25A777b209C21baEE3a68033B74637EAE9",
      "hash": "0xee8b737c8ada56c3eb3e8fab9d8be1db02c799a15666bc38e6e90701ad1c4573"
    },
    "expected_sender": "0x215b5b25A777b209C21baEE3a68033B74637EAE9",
    "expected_recipient": "0xD62707f513F4B472d0BaDd922D74c49e06d9e7c7",
    "expected_fees": "1767913/250000000",
    "expected_emission": {
      "dopex": 0.007071652
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 6,
    "contract_address": "0xdac17f958d2ee523a2206206994597c13d831ec7"
  },
  {
    "transfer": {
      "transaction": "0x9dae8fa7960745b4daf3add1293430ee9f1badab638ceb6eb5369096cb6f511d",
      "log": {
        "data": "AAAAAAAAAAAAAAAAIVtbJad3sgnCG67jpoAzt0Y36ukAAAAAAAAAAAAAAABrF1R06JCUxE2pi5VO7erElScdDwAAAAAAAAAAAAAAANrBf5WNLuUjoiBiBplFl8E9gx7HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG8FtZ07IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5QlwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHodM",
        "address": "0xD62707f513F4B472d0BaDd922D74c49e06d9e7c7",
        "topics": [
          "0xd6d34547c69c5ee3d2667625c188acf1006abb93e0ee7cf03925c67cf7760413"
        ]
      },
      "application": 13
    },
    "transaction": {
      "to": "0xD62707f513F4B472d0BaDd922D74c49e06d9e7c7",
      "from": "0x215b5b25A777b209C21baEE3a68033B74637EAE9",
      "hash": "0x9dae8fa7960745b4daf3add1293430ee9f1badab638ceb6eb5369096cb6f511d"
    },
    "expected_sender": "0x215b5b25A777b209C21baEE3a68033B74637EAE9",
    "expected_recipient": "0xD62707f513F4B472d0BaDd922D74c49e06d9e7c7",
    "expected_fees": "14000000000000000000/1000000000000000000000",
    "expected_emission": {
      "dopex": 0.014
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "transfer": {
      "transaction": "0x00c8e84e01c89e54e20badd8ab979bd92257aae0952de2b0335a4f80a71e9498",
      "log": {
        "data": "AAAAAAAAAAAAAAAAIVtbJad3sgnCG67jpoAzt0Y36ukAAAAAAAAAAAAAAACguGmRxiGLNsHRnUounrDONgbrSAAAAAAAAAAAAAAAAGsXVHTokJTETamLlU7t6sSVJx0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAehH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb8KKqa5Mk2gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwjDosjX9jN",
        "address": "0xD62707f513F4B472d0BaDd922D74c49e06d9e7c7",
        "topics": [
          "0xd6d34547c69c5ee3d2667625c188acf1006abb93e0ee7cf03925c67cf7760413"
        ]
      },
      "application": 13
    },
    "transaction": {
      "to": "0xD62707f513F4B472d0BaDd922D74c49e06d9e7c7",
      "from": "0x215b5b25A777b209C21baEE3a68033B74637EAE9",
      "hash": "0x00c8e84e01c89e54e20badd8ab979bd92257aae0952de2b0335a4f80a71e9498"
    },
    "expected_sender": "0x215b5b25A777b209C21baEE3a68033B74637EAE9",
    "expected_recipient": "0xD62707f513F4B472d0BaDd922D74c49e06d9e7c7",
    "expected_fees": "14192361736025075099/1000000000000000000000",
    "expected_emission": {
      "dopex": 0.01419236173602507509
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  }
]
`
