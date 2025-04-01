// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

// integrationTestLifi: for the first test, an ordinary transaction is
// used. for the second, a gnosis chain transaction
// (0x252443cbf245cab96f0d3b37c216138181b86e21b087da397a992500479016b3)
// is used. it's assumed that the from asset is ETH.
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
        "log_index": "7"
      },
      "application": 26
    },
    "transaction": {
      "to": "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
      "from": "0x6221a9c005f6e47eb398fd867784cacfdcfff4e7",
      "hash": "0x296074fe679540bc567ce1dea5c7745bc0b5d44850b1d92b19949a217e75285d"
    },
    "expected_sender": "0x6221a9c005f6e47eb398fd867784cacfdcfff4e7",
    "expected_recipient": "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
    "expected_fees": "0/1",
    "expected_volume": "49986807/500000",
    "expected_emission": {
      "lifi": 0
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 6,
    "contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
  },
  {
    "transfer": {
      "transaction": "0x252443cbf245cab96f0d3b37c216138181b86e21b087da397a992500479016b3",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAagI8zR/28gRcMwl2jq2eaPl49uEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARnxf+FgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACZS+lJEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhsaWZpLWFwaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
        "address": "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
        "topics": [
          "0x93517b7c6f32856737008edf37cf2542b55d27d83fa299aa216f55a982a6ee1d",
          "0x9954f323686d10489d7357da86cb63b2a8b328804617099ea4f9ef9b0d1062f8"
        ],
        "log_index": "7"
      },
      "application": 26
    },
    "transaction": {
      "to": "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
      "from": "0x1f81e39d2448c2a2bce87350353a199c349614e2",
      "hash": "0x252443cbf245cab96f0d3b37c216138181b86e21b087da397a992500479016b3"
    },
    "expected_sender": "0x1f81e39d2448c2a2bce87350353a199c349614e2",
    "expected_recipient": "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
    "expected_fees": "0/1",
    "expected_volume": "8230044701/50000",
    "expected_emission": {
      "lifi": 0
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 6,
    "contract_address": "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1"
  },
  {
    "transfer": {
      "transaction": "0xce2a8a2d6d93dca969810443e1370bcdb6305c4d19d1cbb0460da86a1ce8e0a0",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAAAALBKD2yGog0BVZBxAul4JNkVgV/rAAAAAAAAAAAAAAAATPpQt850fi1hck/KxX8kt0j/KyoAAAAAAAAAAAAAAACviNBl53yMwiOTJ8Xts6QyJo5YMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABpKW72AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGkoOOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2p1bXBlci5leGNoYW5nZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACoweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "address": "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
        "topics": [
          "0x93517b7c6f32856737008edf37cf2542b55d27d83fa299aa216f55a982a6ee1d",
          "0x9a121dabcb731f79f3d2759054aa8e21c6bd5db086ec06ad84b12a40c25c61a8"
        ],
        "log_index": "7"
      },
      "application": 26
    },
    "transaction": {
      "to": "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
      "from": "0xb04a0f6c86a20d0155907102e97824d915815feb",
      "hash": "0x252443cbf245cab96f0d3b37c216138181b86e21b087da397a992500479016b3"
    },
    "expected_sender": "0xb04a0f6c86a20d0155907102e97824d915815feb",
    "expected_recipient": "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae",
    "expected_fees": "0/1",
    "expected_volume": "882161531/500000",
    "expected_emission": {
      "lifi": 0
    },
    "rpc_methods": {},
    "call_methods": {},
    "token_decimals": 6,
    "contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
  }
]
`
