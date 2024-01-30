// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestLifi = `[
  {
    "transfer": {
      "transaction": "0x296074fe679540bc567ce1dea5c7745bc0b5d44850b1d92b19949a217e75285d",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAAAAGIhqcAF9uR+s5j9hneEys/c//TnAAAAAAAAAAAAAAAAr4jQZed8jMIjkyfF7bOkMiaOWDEAAAAAAAAAAAAAAABM+lC3znR+LWFyT8rFfyS3SP8rKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF9eEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAX1ee4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2p1bXBlci5leGNoYW5nZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACoweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "address": "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
        "topics": [
          "0x38eee76fd911eabac79da7af16053e809be0e12c8637f156e77e1af309b99537",
          "0xe95468926d2a1a6f4bfae9015db362e99c3284319bea5f29d3afe23d32c366bf"
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
    "expected_sender": "0x6221a9c005f6e47eb398fd867784cacfdcfff4e7",
    "expected_recipient": "0x6221a9c005f6e47eb398fd867784cacfdcfff4e7",
    "expected_fees": "1/0",
    "expected_volume": "99973614/1",
    "expected_emission": {
      "lifi": 0
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 6,
    "contract_address": "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae"
  }
]
`
